JSON = require("json")

FrameViews = {}

Handlers.add("getFrameViews",
  Handlers.utils.hasMatchingTag("Action", "Get-Frame-Views"),
  function(message)
    Reply(message, { frameViews = FrameViews })
  end
)

Handlers.add("setupFrameHandlers",
  Handlers.utils.hasMatchingTag("Action", "Setup-Frame-Handlers"),
  function(message)
    if message.From ~= Owner then
      return Reply(message, { error = "Forbidden" })
    end

    local jsonParsed, handlersOrError = pcall(JSON.decode, message.Data)

    if not jsonParsed then
      return Reply(message, { error = "Invalid JSON" })
    end

    local parsedHandlers = {}
    for handlerName, handlerCode in pairs(handlersOrError) do
      local handlerParsed, frameHandlerOrError = pcall(ParseFunction, handlerCode)

      if not handlerParsed then
        return Reply(message, { error = "Invalid Lua code for handler " .. handlerName })
      end

      parsedHandlers[handlerName] = frameHandlerOrError
    end

    ClearFrameHandlers()

    local addedHandlers = {}
    for handlerName, handler in pairs(parsedHandlers) do
      Handlers.add(
        "frameHandler-" .. handlerName,
        Handlers.utils.hasMatchingTag("Action", "Handle-Frame-" .. handlerName),
        function(frameMessage)
          if not FrameViews[handlerName] then
            FrameViews[handlerName] = 1
          else
            FrameViews[handlerName] = FrameViews[handlerName] + 1
          end

          local result = handler(JSON.decode(frameMessage.Data))
          Reply(frameMessage, result)(frameMessage)
        end
      )

      table.insert(addedHandlers, handlerName)
    end

    Reply(message, { addedFrameHandlers = handlerNames })
  end
)

function Reply(message, data)
  Handlers.utils.reply(JSON.encode(data))(message)
end

function ParseFunction(code)
  local wrapperFunction, err = load("return " .. code)
  if wrapperFunction then
    return wrapperFunction()
  else
    error(err)
  end
end

function ClearFrameHandlers()
  local handlerNames = {}
  for k, handler in pairs(Handlers.list) do
    if string.find(handler.name, "frameHandler-") then
      table.insert(list, handler.name)
    end
  end

  for k, handlerName in pairs(handlerNames) do
    Handlers.remove(handlerName)
  end
end

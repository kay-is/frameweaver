local server = { _version = "0.0.1" }

local json = require("json")

server.replyTo = function(message, data)
  local reply = { Target = message.From, Data = '"OK"' }

  if data then
    reply.Data = json.encode(data)
  end

  ao.send(reply)
end

server.addJsonHandler = function(action, handler)
  Handlers.add(action,
    Handlers.utils.hasMatchingTag("Action", action),
    function(message)
      local data = json.decode(message.Data)
      local result = handler(message.From, data)
      server.replyTo(message, json.encode(result))
    end
  )
end

server.error = function(message, code)
  local err = { error = { message = message, code = 400 } }

  if code then
    err.error.code = code
  end

  return err
end

return server

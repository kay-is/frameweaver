local utils = { _version = "0.0.1" }

function utils.map(list, f)
  local newList = {}
  for k, v in pairs(list) do
    newList[k] = f(v, k)
  end
  return newList
end

local function flatten(list)
  local flat = ""
  for _, e in pairs(list) do
    if (type(e) == "table") then
      flat = flat .. flatten(e)
    else
      flat = flat .. e
    end
  end
  return flat
end

local function h(tag, attributes, children)
  if type(attributes) == "string" or attributes[1] then
    children = attributes
    attributes = {}
  end

  local html = "<" .. tag

  for name, value in pairs(attributes) do
    html = html .. " " .. name .. '="' .. value .. '"'
  end

  if not children then
    html = html .. "/>"
    return html
  end

  html = html .. ">"

  if type(children) ~= "table" then
    html = html .. children
  else
    for _, element in pairs(children) do
      if type(element) == "table" then
        element = flatten(element)
      end
      html = html .. element
    end
  end

  html = html .. "</" .. tag .. ">"

  return html
end

function utils.renderFrame(frame, accountId, projectId)
  local imageUrl = "https://arweave.net/" .. frame.image.id
  return h("html", {
    h("title", frame.name),
    h("meta", { property = "og:image", content = imageUrl }),
    h("meta", { property = "fc:frame", content = "vNext" }),
    h("meta", { property = "fc:frame:image", content = imageUrl }),
    h("meta", { property = "fc:frame:image:aspect_ratio", content = frame.image.aspectRatio }),
    h("meta", { property = "fc:frame", content = "vNext" }),
    utils.map(frame.buttons, function(button, i)
      local target = button.target
      if button.action == "post" then
        target = "https://frameweaver.fly.dev/" .. accountId .. "/" .. projectId .. "/" .. button.target
      end

      return {
        h("meta", { property = "fc:frame:button:" .. i, content = button.label }),
        h("meta", { property = "fc:frame:button:" .. i .. ":action", content = button.action }),
        h("meta", { property = "fc:frame:button:" .. i .. ":target", content = target }),
      }
    end),
    h("h1", frame.name),
    h("img", { src = imageUrl }),
    utils.map(frame.buttons, function(button)
      local target = button.target
      if button.action == "post" then
        target = "https://frameweaver.fly.dev/" .. accountId .. "/" .. projectId .. "/" .. button.target
      end
      return h("a", { href = target }, "Click me!")
    end),
  })
end

return utils

local json = require("json")

local buttons = {}

buttons[1] = { label = "Click Me!", action = "link", target = "https://example.com" }
buttons[2] = { label = "Click Me Too!", action = "link", target = "https://example.com" }

ao.send({
  Target = ao.id,
  Tags = { Action = "updateProject" },
  Data = json.encode({
    id = "p123",
    name = "My Project",
    description = "Test",
    initialFrame = {
      id = "initial",
      name = "My Frame",
      image = {
        id = "i6666",
        aspectRatio = "1:1"
      },
      buttons = buttons
    },
    frames = {}
  })
})

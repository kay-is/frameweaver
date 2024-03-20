local json = require("json")

ao.send({
  Target = ao.id,
  Tags = { Action = "getFrameViews" },
  Data = json.encode({ projectId = "p123" })
})

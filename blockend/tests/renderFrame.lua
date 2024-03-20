local json = require("json")

ao.send({
  Target = ao.id,
  Tags = { Action = "renderFrame" },
  Data = json.encode({ projectId = "p123", frameId = "initial" })
})

local utils = require(".utils")
local server = require(".server")

Accounts = {}

server.addJsonHandler("updateProject", function(from, data)
  local account = Accounts[from]

  if not account then
    Accounts[from] = { projects = {} }
    account = Accounts[from]
  end

  local project = account.projects[data.id]

  if not project then
    account.projects[data.id] = {
      id = data.id,
      name = data.name,
      description = data.description,
      initialFrame = data.initialFrame,
      frames = data.frames,
      frameViews = {}
    }
    return { message = "Project Created" }
  end

  project.id = data.id
  project.name = data.name
  project.description = data.description
  project.initialFrame = data.initialFrame
  project.frames = data.frames

  return { message = "Project Updated" }
end)

server.addJsonHandler("renderFrame", function(from, data)
  local account = Accounts[data.accountId]

  if not account then
    return server.error("Account Not Found", 404)
  end

  local project = account.projects[data.projectId]

  if not project then
    return server.error("Project Not Found", 404)
  end

  local frame
  if data.frameId == "initial" then
    frame = project.initialFrame
  else
    for _, foundFrame in pairs(project.frames) do
      if foundFrame.id == data.frameId then
        frame = foundFrame
        break
      end
    end
  end

  if not frame then
    return server.error("Frame Not Found", 404)
  end

  local views = project.frameViews[data.frameId]

  if not views then
    project.frameViews[data.frameId] = 1
  else
    project.frameViews[data.frameId] = views + 1
  end

  return utils.renderFrame(frame, data.accountId, data.projectId)
end)

server.addJsonHandler("getFrameViews", function(from, data)
  local account = Accounts[from]

  if not account then
    return server.error("Account Not Found", 404)
  end

  local project = account.projects[data.projectId]

  if not project then
    return server.error("Project Not Found", 404)
  end

  return project.frameViews
end)

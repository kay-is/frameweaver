import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useAppState } from "../appState"
import * as aoClient from "../processClient"
import { H1, PageContainer } from "./utilities"
import { AccordionFrameItem } from "./projectPage"

export function PublishPage() {
  const navigate = useNavigate()
  const params = useParams()
  const appState = useAppState()
  const [publishing, setPublishing] = useState(false)

  const project = appState.projects.find((p) => p.id === params.projectId)

  if (!project) {
    return (
      <PageContainer>
        <div className="mx-5">
          <H1>Publish Project</H1>
          <p>Project not found!</p>
        </div>
      </PageContainer>
    )
  }

  const handlePublish = async () => {
    setPublishing(true)
    await aoClient.connectWallet()
    await aoClient.updateProject(project)
    project.deployed = Date.now()
    navigate("/project/" + project.id)
  }

  return (
    <PageContainer>
      <div className="mx-5 mb-20">
        <H1>Publish: {project.name}</H1>
        <AccordionFrameItem frame={project.initialFrame} open />
        {project.frames.map((frame) => (
          <AccordionFrameItem frame={frame} key={frame.id} />
        ))}
      </div>
      <div className="btm-nav">
        <button
          className="bg-black text-white"
          onClick={() => handlePublish()}
          disabled={publishing}
        >
          {publishing ? (
            <span className="loading loading-infinity loading-lg"></span>
          ) : (
            "Publish Project"
          )}
        </button>
      </div>
    </PageContainer>
  )
}

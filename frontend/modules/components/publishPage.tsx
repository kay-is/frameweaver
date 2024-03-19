import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import { useAppState } from "../appState"
import {
  connectWallet,
  deployFrameHandlers,
  initializeProcess,
} from "../processClient"
import { H1, PageContainer } from "./utilities"
import { AccordionFrameItem } from "./projectPage"

export function PublishPage() {
  const navigate = useNavigate()
  const params = useParams()
  const appState = useAppState()
  const [publishing, setPublishing] = useState(false)
  const [error, setError] = useState("")

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
    setError("")
    await connectWallet()

    try {
      const processId = await initializeProcess()
      await deployFrameHandlers(processId, [
        ...project.frames,
        project.initialFrame,
      ])
      project.id = processId
      project.deployed = true
      navigate("/project/" + project.id)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message)
      setPublishing(false)
    }
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
      {error !== "" && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error w-200">
            <span>{error}</span>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

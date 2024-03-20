import { Link, useParams } from "react-router-dom"
import { useSignals } from "@preact/signals-react/runtime"

import {
  FrameImageSpec,
  FrameProjectSpec,
  FrameSpec,
  GuiFrameSpec,
  useAppState,
} from "../appState"
import { FramePreview } from "./framePreview"
import { PageContainer } from "./utilities"
import { useEffect, useState } from "react"
import { connectWallet } from "../processClient"

export function ProjectPage() {
  const params = useParams()
  const appState = useAppState()

  const project = appState.projects.find((p) => p.id === params.projectId)

  return (
    <PageContainer>
      {project ? (
        <FrameList project={project} images={appState.images} />
      ) : (
        <p>Project not found!</p>
      )}
    </PageContainer>
  )
}

interface ProjectProps {
  project: FrameProjectSpec
  images: FrameImageSpec[]
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<any>()
  useEffect(() => {
    const f = async () => {
      const wallet = await connectWallet()
      //@ts-expect-error assigned
      const address = await wallet.getActiveAddress()
      setWallet(address)
    }
    f()
  })
  return wallet
}

const FrameList = (props: ProjectProps) => {
  useSignals()
  const address = useWallet()

  const handleAddFrame = () => {
    return props.project.frames.push({
      id: "frame-" + Date.now(),
      name: "New Frame",
      type: "gui",
      image: props.images[0],
      buttons: {
        1: {
          action: "link",
          label: "Example Link Button",
          target: "https://example.com",
        },
        2: { action: "disabled" },
        3: { action: "disabled" },
        4: { action: "disabled" },
      },
    })
  }

  const handleDeleteFrame = (frameId: string) => {
    props.project.frames = props.project.frames.filter((f) => f.id !== frameId)
  }

  return (
    <div className="mx-5">
      <div className="form-control w-full">
        {props.project.deployed > 0 && (
          <a
            href={`https://frameweaver.fly.dev/${address}/${props.project.id}`}
            target="_blank"
            style={{
              fontWeight: "bold",
              color: "black",
              textDecoration: "underline",
            }}
          >
            Deployment URL
          </a>
        )}
        <div className="label">
          <span className="label-text font-bold">Name</span>
        </div>
        <input
          type="text"
          value={props.project.name}
          onChange={(e) => (props.project.name = e.target.value)}
          className="input input-bordered w-full"
          autoFocus
        />
      </div>
      <div className="form-control w-full">
        <div className="label">
          <span className="label-text font-bold">Description</span>
        </div>
        <textarea
          value={props.project.description}
          onChange={(e) => (props.project.description = e.target.value)}
          className="textarea textarea-bordered w-full"
        />
      </div>
      <div className="label">
        <span className="label-text font-bold">Frames</span>
      </div>
      <div className="join join-vertical w-full mb-20">
        <AccordionFrameItem frame={props.project.initialFrame} editable open />
        {props.project.frames.map((frame: GuiFrameSpec) => (
          <AccordionFrameItem
            key={frame.id}
            editable
            frame={frame}
            onDeleteFrame={handleDeleteFrame}
          />
        ))}
      </div>

      <div className="btm-nav">
        <Link
          to={`/project/${props.project.id}/publish`}
          className="bg-black text-white"
        >
          Publish Project
        </Link>
        <button
          className="bg-black text-white"
          onClick={() => handleAddFrame()}
        >
          Add New Frame
        </button>
      </div>
    </div>
  )
}

export interface AccordionFrameItemProps {
  frame: FrameSpec
  open?: boolean
  onDeleteFrame?: (frameId: string) => void
  editable?: boolean
}

export const AccordionFrameItem = (props: AccordionFrameItemProps) => {
  const params = useParams()

  return (
    <div className="collapse collapse-arrow join-item border border-base-300">
      <input type="radio" name="my-accordion-4" defaultChecked={props.open} />
      <div className="collapse-title text-xl font-medium">
        {props.frame.name}
      </div>
      <div className="collapse-content">
        {props.frame.type === "gui" ? (
          <FramePreview frame={props.frame} />
        ) : (
          <p>No preview available for code frames.</p>
        )}
        {props.editable && (
          <div className="join w-full mt-5">
            <Link
              to={`/project/${params.projectId}/edit/${props.frame.id}`}
              className="btn btn-primary join-item grow"
            >
              Edit
            </Link>
            {props.onDeleteFrame && (
              <button
                onClick={() =>
                  props.onDeleteFrame && props.onDeleteFrame(props.frame.id)
                }
                className="btn join-item grow"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

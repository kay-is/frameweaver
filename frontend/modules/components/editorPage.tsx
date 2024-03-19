import { FramePreview } from "./framePreview"
import { useSignals } from "@preact/signals-react/runtime"

import { useParams } from "react-router-dom"
import type {
  FrameImageSpec,
  FrameProjectSpec,
  GuiFrameButtonSpec,
  GuiFrameSpec,
} from "../appState"
import { PageContainer } from "./utilities"
import { useAppState } from "./app"

Component.displayName = "EditorPage"
export function Component() {
  const params = useParams()
  const appState = useAppState()

  const project = appState.projects.find((p) => p.id === params.projectId)

  if (!project)
    return (
      <PageContainer>
        <p>Project not found.</p>
      </PageContainer>
    )

  let frame =
    project.initialFrame.id === params.frameId
      ? project.initialFrame
      : project.frames.find((f) => f.id === params.frameId)

  if (!frame)
    return (
      <PageContainer>
        <p>Frame not found.</p>
      </PageContainer>
    )

  if (frame.type === "gui")
    return <GuiFrameEditor frame={frame} images={appState.images} />
}

interface GuiFrameEditorProps {
  frame: GuiFrameSpec
  images: FrameImageSpec[]
}

const GuiFrameEditor = (props: GuiFrameEditorProps) => {
  useSignals()

  const handleFrameButtonActionChange = (
    buttonIndex: keyof GuiFrameSpec["buttons"],
    action: GuiFrameButtonSpec["action"]
  ) => {
    switch (action) {
      case "link":
        return (props.frame.buttons[buttonIndex] = {
          action: "link",
          label: "",
          target: "",
        })
      case "post":
        return (props.frame.buttons[buttonIndex] = {
          action: "post",
          label: "",
          target: "",
        })
      default:
        return (props.frame.buttons[buttonIndex] = { action: "disabled" })
    }
  }

  return (
    <PageContainer>
      <div className="mx-5">
        <div className="label">
          <span className="label-text font-bold">Preview</span>
        </div>
        <FramePreview frame={props.frame} />
        <form className="mb-20">
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Name</span>
            </div>
            <input
              type="text"
              value={props.frame.name}
              onChange={(e) => (props.frame.name = e.target.value)}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <div className="join-item grow">
              <div className="label">
                <span className="label-text font-bold">Image</span>
              </div>
              <select
                onChange={(e) => {
                  const image = props.images.find(
                    (i) => i.id === e.target.value
                  )
                  if (image) props.frame.image = image
                }}
                className="select select-bordered w-full"
              >
                {props.images.map((image) => (
                  <option value={image.id} key={image.id}>
                    {image.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(["1", "2", "3", "4"] as const).map((buttonIndex) => (
            <FrameButtonItem
              button={props.frame.buttons[buttonIndex]}
              buttonIndex={buttonIndex}
              key={buttonIndex}
              onActionChange={(action) =>
                handleFrameButtonActionChange(buttonIndex, action)
              }
            />
          ))}
        </form>
      </div>
    </PageContainer>
  )
}

interface FrameButtonItemProps {
  button: GuiFrameButtonSpec
  buttonIndex: string
  onActionChange: (action: GuiFrameButtonSpec["action"]) => void
}

const FrameButtonItem = (props: FrameButtonItemProps) => {
  const params = useParams()
  const appState = useAppState()

  const project = appState.projects.find(
    (p) => p.id === params.projectId
  ) as FrameProjectSpec

  const frames = [...project?.frames, project.initialFrame]

  const disabled = props.button.action === "disabled"

  return (
    <div>
      <div className="join w-full">
        <div className="join-item">
          <div className="label">
            <span className="label-text font-bold">
              Button {props.buttonIndex}
            </span>
          </div>
          <select
            value={props.button.action}
            className="select select-bordered"
            onChange={(e) =>
              props.onActionChange(
                e.target.value as GuiFrameButtonSpec["action"]
              )
            }
          >
            <option value="disabled">Disabled</option>
            <option value="link">Link</option>
            <option value="post">Frame</option>
          </select>
        </div>
        <div className="join-item grow">
          <div className="label">
            <span className="label-text">Label</span>
          </div>
          <input
            value={props.button.action === "disabled" ? "" : props.button.label}
            type="text"
            className="input input-bordered w-full"
            disabled={disabled}
            onChange={(e) =>
              props.button.action !== "disabled"
                ? (props.button.label = e.target.value)
                : null
            }
          />
        </div>
      </div>
      <div className="join-item grow" key={props.buttonIndex + "bottom"}>
        {props.button.action === "disabled" && (
          <input className="input input-bordered w-full" disabled />
        )}
        {props.button.action === "link" && (
          <input
            value={props.button.target}
            type="text"
            className="input input-bordered w-full"
            placeholder="Target URL"
            //@ts-expect-error
            onChange={(e) => (props.button.target = e.target.value)}
          />
        )}
        {props.button.action === "post" && (
          <select
            value={props.button.target}
            className="select select-bordered w-full"
            //@ts-expect-error
            onChange={(e) => (props.button.target = e.target.value)}
          >
            {frames.map((frame) => (
              <option value={frame.id} key={frame.id}>
                {frame.name}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}

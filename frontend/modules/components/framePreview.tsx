import { useSignals } from "@preact/signals-react/runtime"
import type { GuiFrameSpec } from "../appState"

interface FramePreviewProps {
  frame: GuiFrameSpec
}

export const FramePreview = (props: FramePreviewProps) => {
  useSignals()
  return (
    <div className="card card-compact bg-base-100 shadow-xl">
      <figure
        className={
          props.frame.image.aspectRatio === "1.91:1"
            ? "aspect-[1.91/1]"
            : "aspect-[1/1]"
        }
      >
        <img src={"https://arweave.net/" + props.frame.image.id} />
      </figure>
      <div className="card-body">
        <div className="card-actions">
          {Object.values(props.frame.buttons)
            .filter((b) => !!b)
            .map((button, index) => {
              return (
                button.action !== "disabled" && (
                  <div
                    key={index}
                    className="tooltip grow"
                    data-tip={button.action + ": " + button.target}
                  >
                    <button className="btn btn-sm w-full">
                      {button.label}
                    </button>
                  </div>
                )
              )
            })}
        </div>
      </div>
    </div>
  )
}

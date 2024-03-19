import { effect } from "@preact/signals-react"
import { deepSignal } from "deepsignal/react"

export type CodeFrameSpec = {
  type: "code"
  id: string
  name: string
  code: string
}

export type GuiFrameLinkButtonSpec = {
  action: "link"
  label: string
  target: string
}
export type GuiFramePostButtonSpec = {
  action: "post"
  label: string
  target: string
}
export type GuiFrameDisabledButtonSpec = {
  action: "disabled"
}

export type GuiFrameButtonSpec =
  | GuiFrameDisabledButtonSpec
  | GuiFrameLinkButtonSpec
  | GuiFramePostButtonSpec

export type FrameImageSpec = {
  id: string
  name: string
  aspectRatio: "1.91:1" | "1:1"
}

export type GuiFrameSpec = {
  type: "gui"
  id: string
  name: string
  image: FrameImageSpec
  buttons: {
    "1": GuiFrameButtonSpec
    "2": GuiFrameButtonSpec
    "3": GuiFrameButtonSpec
    "4": GuiFrameButtonSpec
  }
}

export type FrameSpec = GuiFrameSpec | CodeFrameSpec

export type FrameProjectSpec = {
  id: string
  name: string
  description: string
  deployed: boolean
  initialFrame: GuiFrameSpec
  frames: GuiFrameSpec[]
}

export type AppState = {
  images: FrameImageSpec[]
  projects: FrameProjectSpec[]
}

export const createAppState = (stateId: string) => {
  const savedState = localStorage.getItem(stateId)

  const initialState = savedState
    ? JSON.parse(savedState)
    : {
        images: [
          {
            id: "Ktppi5YBXENqprwJ-DZmbI_n9bnHNoe5Eif3OCfHyeE",
            name: "placeholder.png",
            aspectRatio: "1.91:1",
          },
        ],
        projects: [],
      }

  const appState = deepSignal<AppState>(initialState)

  effect(() => {
    localStorage.setItem(stateId, JSON.stringify(appState))
  })

  return appState
}

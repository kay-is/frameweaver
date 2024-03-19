import { PropsWithChildren } from "react"
import { Link, useLocation, useParams } from "react-router-dom"

import { FrameSpec, useAppState } from "../appState"

export function H1(props: PropsWithChildren) {
  return <h1 className="text-lg font-bold mb-2" {...props} />
}

export function Loading() {
  return <span className="loading loading-infinity loading-lg" />
}

export const PageContainer = (props: PropsWithChildren) => {
  return (
    <div className="container mx-auto max-w-xl">
      <Navigation />
      {props.children}
    </div>
  )
}

export function Navigation() {
  const appState = useAppState()
  const location = useLocation()
  const params = useParams()

  const project = appState.projects.find((p) => p.id === params.projectId)

  let frame: FrameSpec | undefined
  if (project) {
    if (project.initialFrame.id === params.frameId) frame = project.initialFrame
    else frame = project.frames.find((f) => f.id === params.frameId)
  }

  return (
    <div className="navbar bg-base-100">
      <div className="text-sm breadcrumbs ml-5">
        <ul>
          {(location.pathname.includes("/projects") || project) && (
            <li>
              <Link to="/projects">Projects</Link>
            </li>
          )}
          {location.pathname.includes("image-upload") && (
            <li>
              <Link to="/projects/image-upload">Image Upload</Link>
            </li>
          )}
          {project && (
            <li>
              <Link to={"/project/" + project.id}>
                {project.name || "Project"}
              </Link>
            </li>
          )}
          {project && location.pathname.includes("publish") && (
            <li>
              <Link to={"/project/" + project.id + "/publish"}>Publish</Link>
            </li>
          )}
          {!!project && !!frame && (
            <li>
              <Link to={"/project/" + project.id + "/" + frame.id}>
                {frame.name}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

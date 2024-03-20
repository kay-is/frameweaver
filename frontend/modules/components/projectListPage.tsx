import { Link, useNavigate } from "react-router-dom"

import { FrameProjectSpec, useAppState } from "../appState"
import { H1, PageContainer } from "./utilities"
import { useWallet } from "./projectPage"

export function ProjectListPage() {
  const address = useWallet()
  const navigate = useNavigate()
  const appState = useAppState()

  const handleCreateProject = () => {
    const newProject: FrameProjectSpec = {
      id: "project-" + Date.now(),
      name: "",
      deployed: 0,
      description: "A new project comes with an intial frame.",
      initialFrame: {
        type: "gui",
        id: "initial",
        name: "Initial Frame",
        image: appState.images[0],
        buttons: {
          1: {
            action: "link",
            label: "Example Button ✨",
            target: "https://example.com",
          },
          2: { action: "disabled" },
          3: { action: "disabled" },
          4: { action: "disabled" },
        },
      },
      frames: [],
    }

    appState.projects.push(newProject)

    navigate("/project/" + newProject.id)
  }

  const handleDeleteProject = (projectId: string) => {
    appState.projects = appState.projects.filter((p) => p.id !== projectId)
  }

  return (
    <PageContainer>
      <div className="mx-5 mb-20">
        <H1>
          Projects{" "}
          <div className="badge badge-outline">{appState.projects.length}</div>
        </H1>
        {appState.projects.map((project) => (
          <div key={project.id}>
            <div className="card card-compact bg-base-100 shadow-xl mb-5">
              <figure
                className={
                  project.initialFrame.image.aspectRatio === "1.91:1"
                    ? "aspect-[1.91/1]"
                    : "aspect-[1/1]"
                }
              >
                <img
                  src={"https://arweave.net/" + project.initialFrame.image.id}
                  alt="Initial frame image"
                  loading="lazy"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">
                  {project.name}
                  {project.deployed !== 0 ? (
                    <div className="badge badge-outline">
                      {new Date(project.deployed).toLocaleDateString() + " - "}
                      {new Date(project.deployed).toLocaleTimeString()}
                    </div>
                  ) : (
                    <div className="badge badge-outline">Not Published</div>
                  )}
                </h2>
                {project.deployed > 0 && (
                  <a
                    href={`https://frameweaver.fly.dev/${address}/${project.id}`}
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
                <p>{project.description}</p>
              </div>

              <div className="card-actions justify-stretch">
                <button
                  className="btn"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </button>

                <Link
                  to={`/project/${project.id}/publish`}
                  className="btn btn-primary grow"
                >
                  Publish
                </Link>
                <Link
                  to={`/project/${project.id}`}
                  className="btn btn-primary grow"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}

        <H1>
          Images{" "}
          <div className="badge badge-outline">{appState.images.length}</div>
        </H1>
        {appState.images.map((image) => (
          <div key={image.id} className="collapse collapse-arrow bg-base-200">
            <input type="radio" name="my-accordion-2" />
            <div className="collapse-title text-xl font-medium">
              {image.name}
            </div>
            <div className="collapse-content">
              <img
                loading="lazy"
                src={"https://arweave.net/" + image.id}
                alt={image.name}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="btm-nav">
        <Link to="/projects/image-upload" className="bg-black text-white">
          Upload Image
        </Link>
        <button className="bg-black text-white" onClick={handleCreateProject}>
          Create New Project
        </button>
      </div>
    </PageContainer>
  )
}

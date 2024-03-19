import { HashRouter, Route, Routes } from "react-router-dom"

import { AppStateContext, createAppState } from "../appState"
import { LandingPage } from "./landingPage"
import { ProjectListPage } from "./projectListPage"
import { ImageUploadPage } from "./imageUploadPage"
import { ProjectPage } from "./projectPage"
import { PublishPage } from "./publishPage"
import { EditorPage } from "./editorPage"

function App() {
  return (
    <AppStateContext.Provider value={createAppState("development")}>
      <HashRouter>
        <Routes>
          <Route path="/" Component={LandingPage} />
          <Route path="/projects" Component={ProjectListPage} />
          <Route path="/projects/image-upload" Component={ImageUploadPage} />
          <Route path="/project/:projectId" Component={ProjectPage} />
          <Route path="/project/:projectId/publish" Component={PublishPage} />
          <Route
            path="/project/:projectId/edit/:frameId"
            Component={EditorPage}
          />
        </Routes>
      </HashRouter>
    </AppStateContext.Provider>
  )
}

export default App

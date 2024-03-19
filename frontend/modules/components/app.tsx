import { createContext, useContext } from "react"
import { useSignals } from "@preact/signals-react/runtime"
import { HashRouter, Route, Routes } from "react-router-dom"
import { ArweaveWalletKit } from "arweave-wallet-kit"

import { createAppState } from "../appState"

const AppStateContext = createContext({} as ReturnType<typeof createAppState>)

export const useAppState = () => {
  useSignals()
  return useContext(AppStateContext)
}

const appState = createAppState("stateWithImages")

function App() {
  return (
    <ArweaveWalletKit theme={{ radius: "none" }}>
      <AppStateContext.Provider value={appState}>
        <HashRouter>
          <Routes>
            <Route path="/" lazy={() => import("./landingPage")} />
            <Route path="/projects" lazy={() => import("./landingPage")} />
            <Route
              path="/projects/image-upload"
              lazy={() => import("./imageUploadPage")}
            />
            <Route
              path="/project/:projectId"
              lazy={() => import("./projectPage")}
            />
            <Route
              path="/project/:projectId/publish"
              lazy={() => import("./publishPage")}
            />
            <Route
              path="/project/:projectId/edit/:frameId"
              lazy={() => import("./editorPage")}
            />
          </Routes>
        </HashRouter>
      </AppStateContext.Provider>
    </ArweaveWalletKit>
  )
}

export default App

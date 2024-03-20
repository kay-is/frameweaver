import { createDataItemSigner, message, result } from "@permaweb/aoconnect"

import { ArweaveWebWallet } from "arweave-wallet-connector"
import type { FrameProjectSpec } from "./appState"

const FRAMEWEAVER_PROCESS_ID = "QBy66khondqkKmSjolp6fUWIiCfHDxq3k45k8hfRcJo"

let wallet = new ArweaveWebWallet({ name: "Connect to Frameweaver" })
wallet.setUrl("arweave.app")
let signer: ReturnType<typeof createDataItemSigner>

//@ts-expect-error arweaveWallet exists
if (globalThis.arweaveWallet) {
  //@ts-expect-error arweaveWallet exists
  wallet = globalThis.arweaveWallet
}

const call = async (action: string, data: any) => {
  const messageId = await message({
    signer,
    process: FRAMEWEAVER_PROCESS_ID,
    tags: [{ name: "Action", value: action }],
    data: JSON.stringify(data),
  })
  const response = await result({
    process: FRAMEWEAVER_PROCESS_ID,
    message: messageId,
  })
  return JSON.parse(response.Messages[0].Data)
}

export const connectWallet = async () => {
  await wallet.connect([
    "ACCESS_ADDRESS",
    "ACCESS_ALL_ADDRESSES",
    "SIGN_TRANSACTION",
  ])
  signer = createDataItemSigner(wallet)

  return wallet
}

export const updateProject = async (project: FrameProjectSpec) => {
  console.log("Updating project...")
  console.log(project)
  const data = await call("updateProject", project)
  project.deployed = Date.now()
  console.log("Done!")
  return data
}

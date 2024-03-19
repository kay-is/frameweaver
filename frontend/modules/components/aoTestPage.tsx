/*
import { useState } from "react"
import {
  createDataItemSigner,
  message,
  result,
  spawn,
} from "@permaweb/aoconnect"

const setupCode = `
function test()
  print("TEST")
end
`

export function AoTestPage() {
  const [signer, setSigner] = useState()
  const [action, setAction] = useState("Eval")
  const [messageInput, setMessageInput] = useState(setupCode)
  const [process, setProcess] = useState(localStorage.getItem("pid") || "")

  const connectWallet = async () => {
    await globalThis.arweaveWallet.connect([
      "ACCESS_ADDRESS",
      "ACCESS_ALL_ADDRESSES",
      "SIGN_TRANSACTION",
    ])
    setSigner(createDataItemSigner(globalThis.arweaveWallet))
  }

  const spawnAoProcess = async () => {
    console.log("Spawning process...")

    const processId = await spawn({
      signer,
      module: "SBNb1qPQ1TDwpD_mboxm2YllmMLXpWw4U8P9Ff8W9vk",
      scheduler: "TZ7o7SIZ06ZEJ14lXwVtng1EtSx60QkPy-kh-kdAXog",
    })
    localStorage.setItem("pid", processId)
    setProcess(processId)
    console.log("Done!")
  }

  const sendAoMessage = async () => {
    console.log(`Sending ${action} to ${process} ...`)

    const messageId = await message({
      signer,
      process,
      tags: [{ name: "Action", value: action }],
      data: messageInput,
    })
    console.log("Fetching result...")
    const messageResult = await result({ process, message: messageId })
    console.log(JSON.stringify(messageResult, null, 2))
  }

  if (!signer) return <button onClick={connectWallet}>Connect Wallet</button>

  return (
    <div>
      <button onClick={spawnAoProcess}>Spawn AO Process</button>
      <label>
        Process ID
        <input value={process} onChange={(e) => setProcess(e.target.value)} />
      </label>
      <br />
      <br />

      <button onClick={sendAoMessage}>Send Message</button>
      <label>
        Action
        <input value={action} onChange={(e) => setAction(e.target.value)} />
      </label>
      <br />
      <br />

      <label>
        Message Data
        <br />
        <textarea
          rows={10}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
      </label>
    </div>
  )
}
*/

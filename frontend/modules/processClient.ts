import { createDataItemSigner, message, spawn } from "@permaweb/aoconnect"

import type { GuiFrameSpec } from "./appState"

const AOS_MODULE_TXID = "SBNb1qPQ1TDwpD_mboxm2YllmMLXpWw4U8P9Ff8W9vk"
const SU_ADDRESS = "TZ7o7SIZ06ZEJ14lXwVtng1EtSx60QkPy-kh-kdAXog"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

//@ts-expect-error
let signer = createDataItemSigner(globalThis.arweaveWallet)

const retry = (f: Function, times = 5) =>
  new Promise(async (resolve, reject) => {
    let errors = []
    for (let retries = 1; retries <= times; ++retries) {
      try {
        await f()
        resolve(null)
        break
      } catch (e) {
        errors.push(e)
        const ms = 10000 * retries
        console.log("Retrying in " + ms / 1000 + "sec...")
        await sleep(ms)
      }
    }
    reject(errors)
  })

export const connectWallet = async () => {
  //@ts-expect-error
  await globalThis.arweaveWallet.connect([
    "ACCESS_ADDRESS",
    "ACCESS_ALL_ADDRESSES",
    "SIGN_TRANSACTION",
  ])
  //@ts-expect-error
  signer = createDataItemSigner(globalThis.arweaveWallet)
}

export const initializeProcess = async () => {
  console.log("Spawning process...")
  const processId = await spawn({
    signer,
    module: AOS_MODULE_TXID,
    scheduler: SU_ADDRESS,
  })

  console.log("Loading setup code...")
  const setupCode = await fetch("/process.lua").then((r) => r.text())

  console.log("Deploying setup code...")
  await retry(() =>
    message({
      signer,
      process: processId,
      tags: [{ name: "Action", value: "Eval" }],
      data: setupCode,
    })
  )

  console.log("Process initialized!")
  return processId
}

export const deployFrameHandlers = async (
  processId: string,
  frames: GuiFrameSpec[]
) => {
  console.log(`Deploying ${frames.length + 1} frame handlers...`)

  const frameHandlers: { [x: string]: string } = {}
  frames.forEach(
    (frame) => (frameHandlers[frame.id] = createFrameHandlerCode(frame))
  )

  await retry(() =>
    message({
      signer,
      process: processId,
      tags: [{ name: "Action", value: "Setup-Frame-Handlers" }],
      data: JSON.stringify(frameHandlers),
    })
  )

  console.log("Frames deployed!")
}

const createFrameHandlerCode = (frame: GuiFrameSpec) => `
function(message)
  return [[
    <title>${frame.name}</title>
    
    <meta property="og:image" content="https://arweave.net/${frame.image.id}" />
    
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="https://arweave.net/${
      frame.image.id
    }" />
    <meta property="fc:frame:image:aspect_ratio" content="${
      frame.image.aspectRatio
    }" />

    ${([1, 2, 3, 4] as const)
      .map((index) => ({ button: frame.buttons[index], index }))
      .filter((button) => button.button.action !== "disabled")
      .map(
        ({ button, index }) => `
        <meta property="fc:frame:button:${index}" content="${
          button.action !== "disabled" && button.label
        }" />
        <meta property="fc:frame:button:${index}:action" content="${
          button.action
        }" />
        <meta property="fc:frame:button:${index}:target" content="${
          button.action !== "disabled" && button.target
        }" />`
      )
      .join("\n\n")}

    <h1>${frame.name}</h1>
    <img src="https://arweave.net/${frame.image.id}" alt="frame image" />
    ${([1, 2, 3, 4] as const)
      .map((index) => frame.buttons[index])
      .filter((button) => button.action !== "disabled")
      .map(
        (button) =>
          `<a href="${button.action !== "disabled" && button.target}">${
            button.action !== "disabled" && button.label
          }</a>`
      )
      .join("\n\n")}
  ]]
end
`

import fs from "node:fs"
import * as ao from "@permaweb/aoconnect"

import type { UntrustedData } from "./messsage.types.js"

const serverAddress = "z9dyZlB05vijb0S78eTUxRem0jJjnyEghG9GAANjXbY"

const wallet = JSON.parse(
  fs.readFileSync("C:/Users/k/.aos.json", { encoding: "utf-8" })
)
const signer = ao.createDataItemSigner(wallet)

export const callFrameHandler = async (
  process: string,
  handler: string,
  message?: UntrustedData
) => {
  const config = {
    signer,
    process,
    tags: [{ name: "Action", value: "Handle-Frame-" + handler }],
  }

  if (message) config.data = JSON.stringify(message)

  const messageId = await ao.message(config)
  const result = await ao.result({ process, message: messageId })
  console.log(result)
  return result.Messages[0].Data
}

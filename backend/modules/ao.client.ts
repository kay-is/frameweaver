import fs from "node:fs"
import * as ao from "@permaweb/aoconnect"

const FRAMEWEAVER_PROCESS_ID = "QBy66khondqkKmSjolp6fUWIiCfHDxq3k45k8hfRcJo"

const wallet = JSON.parse(
  fs.readFileSync("/home/codespace/.aos.json", { encoding: "utf-8" })
)
const signer = ao.createDataItemSigner(wallet)

export const callFrameHandler = async (
  accountId: string,
  projectId: string,
  frameId: string
) => {
  const messageId = await ao.message({
    signer,
    process: FRAMEWEAVER_PROCESS_ID,
    tags: [{ name: "Action", value: "renderFrame" }],
    data: JSON.stringify({ accountId, projectId, frameId }),
  })
  const res = await ao.result({
    process: FRAMEWEAVER_PROCESS_ID,
    message: messageId,
  })

  return JSON.parse(res.Messages[0].Data)
}

import * as ao from "@permaweb/aoconnect"

const wallet = JSON.parse(process.env.FRAMEWEAVER_WALLET)
const signer = ao.createDataItemSigner(wallet)

export const callFrameHandler = async (
  accountId: string,
  projectId: string,
  frameId: string
) => {
  const messageId = await ao.message({
    signer,
    process: process.env.FRAMEWEAVER_PROCESS_ID,
    tags: [{ name: "Action", value: "renderFrame" }],
    data: JSON.stringify({ accountId, projectId, frameId }),
  })
  const res = await ao.result({
    process: process.env.FRAMEWEAVER_PROCESS_ID,
    message: messageId,
  })

  return JSON.parse(res.Messages[0].Data)
}

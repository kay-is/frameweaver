import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { Type } from "@sinclair/typebox"

import { callFrameHandler } from "./ao.client.js"
import { farcasterMessage } from "./messsage.types.js"

const app = Fastify().withTypeProvider<TypeBoxTypeProvider>()

app.get(
  "/:accountId/:projectId",
  {
    schema: {
      params: Type.Object({
        accountId: Type.String(),
        projectId: Type.String(),
      }),
    },
  },
  async ({ params }, reply) => {
    reply.type("text/html")
    const frameHtml = await callFrameHandler(
      params.accountId,
      params.projectId,
      "initial"
    )
    return JSON.parse(frameHtml)
  }
)

app.all(
  "/:accountId/:projectId/:frameId",
  {
    schema: {
      params: Type.Object({
        accountId: Type.String(),
        projectId: Type.String(),
        frameId: Type.String(),
      }),
    },
  },
  async ({ params }, reply) => {
    reply.type("text/html")
    console.log(params)
    const frameHtml = await callFrameHandler(
      params.accountId,
      params.projectId,
      params.frameId
    )
    return JSON.parse(frameHtml)
  }
)

try {
  await app.listen({ port: 3000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

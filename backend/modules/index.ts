import Fastify from "fastify"
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import { Type } from "@sinclair/typebox"

import { callFrameHandler } from "./ao.client.js"
import { farcasterMessage } from "./messsage.types.js"

const app = Fastify().withTypeProvider<TypeBoxTypeProvider>()

app.get(
  "/:processId",
  {
    schema: {
      params: Type.Object({
        processId: Type.String(),
      }),
    },
  },
  async ({ params }, reply) => {
    reply.type("text/html")
    return await callFrameHandler(params.processId, "initial")
  }
)

app.post(
  "/:processId/:handlerId",
  {
    schema: {
      body: farcasterMessage,
      params: Type.Object({
        processId: Type.String(),
        handlerId: Type.String(),
      }),
    },
  },
  async ({ body, params }, reply) => {
    reply.type("text/html")
    return await callFrameHandler(
      params.processId,
      params.handlerId,
      body.untrustedData
    )
  }
)

try {
  await app.listen({ port: 3000 })
} catch (err) {
  app.log.error(err)
  process.exit(1)
}

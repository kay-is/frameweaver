import { Static, Type } from "@sinclair/typebox"

export const untrustedData = Type.Object({
  fid: Type.Number(),
  url: Type.String(),
  messageHash: Type.String(),
  timestamp: Type.Number(),
  network: Type.Number(),
  buttonIndex: Type.Union([
    Type.Literal(1),
    Type.Literal(2),
    Type.Literal(3),
    Type.Literal(4),
  ]),
  inputText: Type.Optional(Type.String()),
  state: Type.String(),
  castId: Type.Object({
    fid: Type.Number(),
    hash: Type.String(),
  }),
})

export const trustedData = Type.Object({
  messageBytes: Type.String(),
})

export const farcasterMessage = Type.Object({
  untrustedData,
  trustedData,
})

export type UntrustedData = Static<typeof untrustedData>
export type TrustedData = Static<typeof trustedData>
export type FarcasterMessage = Static<typeof farcasterMessage>

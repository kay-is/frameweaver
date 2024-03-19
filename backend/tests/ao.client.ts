import { callFrameHandler } from "../modules/ao.client.js"

let result = await callFrameHandler(
  "z9dyZlB05vijb0S78eTUxRem0jJjnyEghG9GAANjXbY",
  "init"
)
console.log(result + "\n")

result = await callFrameHandler(
  "z9dyZlB05vijb0S78eTUxRem0jJjnyEghG9GAANjXbY",
  "show-fid",
  //@ts-expect-error
  { fid: 123 }
)
console.log(result + "\n")

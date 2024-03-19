export const projects = [
  {
    id: "ppppp1111",
    name: "Demo Project",
    description: "This is a demo of AO powered Permaframes",
    initialFrame: {
      id: "1111aaaa",
      name: "Initial Frame",
      type: "gui",
      image:
        "https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg",
      aspect_ratio: "1.91:1",
      "button:1": "Link Button",
      "button:1:action": "link",
      "button:1:target": "https://example.com",
      "button:2": "Post Button",
      "button:2:action": "post",
      "button:2:target": "2222bbbb",
    },
    frames: [
      {
        id: "2222bbbb",
        name: "Frame 2",
        type: "code",
        code: `
function(message)
  return '<meta property="fc:frame:version" content="vNext" />' ..
  '<meta property="fc:frame:image" content="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" />' ..
  '<meta property="og:image" content="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" />'..
  '<meta property="fc:frame:button:1" content="' .. message.fid .. '" />'
end
        `,
      },
    ],
  },
]

import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import arweave from "arweave"
import { TurboFactory } from "@ardrive/turbo-sdk/web"

import { useAppState } from "../appState"
import { H1, PageContainer } from "./utilities"

export function ImageUploadPage() {
  const navigate = useNavigate()
  const appState = useAppState()
  const [uploading, setUploading] = useState(false)
  const [size, setSize] = useState(0)
  const [preview, setPreview] = useState("")
  const [aspectRatio, setAspectRatio] = useState<"1.91:1" | "1:1">("1.91:1")
  const fileInput = useRef<HTMLInputElement>(null)

  const handleImageSelect = () => {
    const files = fileInput.current?.files
    if (files) {
      setSize(files[0].size)
      setPreview(URL.createObjectURL(files[0]))
    }
  }

  const handleUploadImage = async () => {
    const files = fileInput.current?.files

    if (files) {
      setUploading(true)
      const jwk = await arweave.crypto.generateJWK()
      const turbo = TurboFactory.authenticated({ privateKey: jwk })
      const uploadResult = await turbo.uploadFile({
        //@ts-expect-error assigned
        fileStreamFactory: () => files[0].stream(),
        fileSizeFactory: () => files[0].size,
      })

      appState.images.push({
        id: uploadResult.id,
        name: files[0].name,
        aspectRatio,
      })

      navigate("/projects")
    }
  }

  return (
    <PageContainer>
      <div className="mx-5">
        <H1>Image Upload</H1>
        <div className="join">
          <div className="form-control w-full">
            <div className="label">
              <span className="label-text font-bold">Image</span>
            </div>
            <input
              type="file"
              ref={fileInput}
              onChange={handleImageSelect}
              className="file-input file-input-bordered w-full"
            />
          </div>
          <div className="join-item flex-none">
            <div className="label">
              <span className="label-text">Aspect Ratio</span>
            </div>
            <select
              name="aspect_ratio"
              className="select select-bordered w-full"
              value={aspectRatio}
              //@ts-expect-error target has value
              onChange={(e) => setAspectRatio(e.target.value)}
            >
              <option value="1.91:1">1.91:1</option>
              <option value="1:1">1:1</option>
            </select>
          </div>
        </div>

        <div className="label">
          <span className="label-text font-bold">Preview</span>
        </div>
        {preview && (
          <img
            src={preview}
            alt="upload preview"
            className={`aspect-[${aspectRatio === "1:1" ? "1/1" : "1.91/1"}]`}
          />
        )}
      </div>

      <div className="btm-nav">
        <button
          className="bg-black text-white"
          onClick={handleUploadImage}
          disabled={size > 102400 || uploading}
        >
          {uploading ? (
            <span className="loading loading-infinity loading-lg"></span>
          ) : (
            "Upload Image"
          )}
        </button>
      </div>

      {size > 102400 && (
        <div className="toast toast-end">
          <div className="alert alert-warning">
            <span>Image must be smaller than 100KB.</span>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

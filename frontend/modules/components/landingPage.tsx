import { Link } from "react-router-dom"
import { PageContainer } from "./utilities"

Component.displayName = "LandingPage"
export function Component() {
  return (
    <PageContainer>
      <div className="hero bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Frameweaver</h1>
            <p className="py-6">Build AO powered Farcaster Frames with ease.</p>
            <Link to="/projects" className="btn btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

import { SignupForm } from "@/components/signup-form"
import { GalleryVerticalEnd } from "lucide-react"
import animated from "@/assets/grades-animate.svg"
import logo from '@/assets/gradifyLogo.svg'
export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md border border-solid border-primary text-primary-foreground">
              <img src={logo} alt="Logo" className="h-6 w-6" />
            </div>
            Gradify
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignupForm />
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-center relative justify-center bg-primary shadow-2xs">
        <div className="flex flex-col h-auto items-center justify-center text-white gap-2">
            <h1 className="text-6xl font-bold">Join Gradify</h1>
            <h3 className="text-xl font-bold italic">From struggling to succeeding</h3>
        </div>
        <img src={animated} alt="Illustration" className="animated h-128 w-128" />
      </div>
    </div>
  )
}
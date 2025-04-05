import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTPPattern } from "./code_input"
import { useNavigate } from "react-router-dom"
export function EnterCodeForm({
  className,
  ...props
}) {
  const navigate = useNavigate()
  return (
    (<form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-nowrap">Check Your Email for Reset Code</h1>
        <p className="text-muted-foreground text-sm text-balance">
          We've sent a verification code to your email to reset your password
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="code">Enter the code sent to you here</Label>
          <div className="flex items-center justify-center gap-2">
            <InputOTPPattern id="code" type="text" placeholder="XXXXXX" className="border border-border focus:ring-primary focus:border-primary" required />
          </div>
        </div>
        <Button type="submit" onClick={()=>navigate('/reset-password')} className="w-full">
          Verify code
        </Button>
      </div>
      <div className="text-center text-sm">
        Go back to {" "}
        <a href="/signup" className="underline underline-offset-4">
          Log in?
        </a>
      </div>
    </form>)
  );
}
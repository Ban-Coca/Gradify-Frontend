
import { BarChart3, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function parseWeight(weight) {
  if (weight === null || weight === undefined || weight === "") return null

  const numericWeight = typeof weight === "number" ? weight : Number.parseFloat(weight)

  if (!Number.isFinite(numericWeight)) return null

  return Math.max(0, Math.min(100, Number.parseFloat(numericWeight.toFixed(2))))
}

export function GradeBreakDown({
  schemeLoading = false,
  scheme = [],
  description = "How your final grade is calculated",
  triggerLabel = "View grading breakdown",
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
}) {
  const hasScheme = Array.isArray(scheme) && scheme.length > 0

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={triggerVariant}
          size={triggerSize}
          className={cn("flex items-center gap-2", triggerClassName)}
        >
          {schemeLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading breakdown</span>
            </>
          ) : (
            <>
              <BarChart3 className="h-4 w-4" />
              <span>{triggerLabel}</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Grading Breakdown</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] pr-2">
          {schemeLoading ? (
            <div className="space-y-3 py-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : hasScheme ? (
            <div className="space-y-3 py-2">
              {scheme.map((item, idx) => {
                const weight = parseWeight(item?.weight)
                const displayWeight = weight !== null ? `${weight}%` : "N/A"

                return (
                  <Card key={item?.id || idx} className="border-l-4 border-l-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-6">
                        <div>
                          <h4 className="font-medium">{item?.name || "Unnamed component"}</h4>
                          <p className="text-sm text-muted-foreground">Weight in final grade</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{displayWeight}</p>
                        </div>
                      </div>
                      {weight !== null && <Progress value={weight} className="mt-2" />}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              <BarChart3 className="mx-auto mb-3 h-12 w-12" />
              <p>No grading scheme available</p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

import { useState } from "react";
import { Activity, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useGrading } from "@/hooks/use-grading";
import { useAuth } from "@/contexts/authentication-context";
export default function GradingSchemeModal({
  open,
  onOpenChange,
  initialData,
  classId,
  assessments = ["Quizzes", "Midterm Exam", "Final Exam"],
}) {
  const { currentUser } = useAuth();
  const { saveScheme } = useGrading({currentUser, classId});

  const [weights, setWeights] = useState(() => {
    if (initialData) {
      try {
        return JSON.parse(initialData);
      } catch (e) {
        return assessments.map((name) => ({
          name,
          weight: 100 / assessments.length,
        }));
      }
    }
    return assessments.map((name) => ({
      name,
      weight: 100 / assessments.length,
    }));
  });

  // Weight management
  const addWeight = () => {
    setWeights([...weights, { name: "", weight: 0 }]);
  };

  const removeWeight = (index) => {
    setWeights(weights.filter((_, i) => i !== index));
  };

  const updateWeight = (index, field, value) => {
    const updatedWeights = [...weights];
    updatedWeights[index] = {
      ...updatedWeights[index],
      [field]: field === "name" ? value : Number(value),
    };
    setWeights(updatedWeights);
  };

  const handleSave = () => {
    // Normalize weights to ensure they sum to 100%
    const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
    const normalizedWeights = weights.map((w) => ({
      ...w,
      weight: totalWeight === 100 ? w.weight : (w.weight / totalWeight) * 100,
    }));
    console.log("user", currentUser.userId);
    console.log("classId", classId);
    console.log("Saving normalized weights:", normalizedWeights);
    const gradingScheme = {
      schemes: normalizedWeights,
    }
    console.log("Grading scheme:", gradingScheme);
    saveScheme.mutate(gradingScheme);

    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // Calculate total weight
  const totalWeight = weights.reduce((sum, w) => sum + w.weight, 0);
  const weightWarning = totalWeight !== 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Activity className="mr-2 h-4 w-4" />
          Configure Assessment Weights
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assessment Weights Configuration</DialogTitle>
          <DialogDescription>
            Define the weight of each assessment component for calculating the
            final grade.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-12 gap-2 font-medium text-sm">
            <div className="col-span-6">Assessment</div>
            <div className="col-span-4">Weight (%)</div>
            <div className="col-span-2">Actions</div>
          </div>

          {weights.map((weight, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-6">
                <Input
                  value={weight.name}
                  onChange={(e) => updateWeight(index, "name", e.target.value)}
                  placeholder="Q1, Midterm, etc."
                />
              </div>
              <div className="col-span-4">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={weight.weight}
                  onChange={(e) =>
                    updateWeight(index, "weight", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeWeight(index)}
                  disabled={weights.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {weightWarning && (
            <Alert variant="warning" className="mt-2">
              <AlertDescription>
                Total weight: {totalWeight.toFixed(1)}% (should equal 100%).
                Values will be normalized when saved.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mt-2">
            <Button variant="outline" onClick={addWeight} size="sm">
              <Plus className="h-4 w-4 mr-2" /> Add Assessment
            </Button>
            <div
              className={`text-sm ${
                weightWarning ? "text-amber-500" : "text-green-500"
              } font-medium`}
            >
              Total: {totalWeight.toFixed(1)}%
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSave}>Save Weights</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

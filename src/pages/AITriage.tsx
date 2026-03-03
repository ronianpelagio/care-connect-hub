import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, AlertTriangle, CheckCircle2, Clock, ArrowRight, Stethoscope, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const symptomCategories = [
  { label: "Headache", emoji: "🤕" },
  { label: "Fever", emoji: "🌡️" },
  { label: "Cough", emoji: "😷" },
  { label: "Chest Pain", emoji: "💔" },
  { label: "Stomach Pain", emoji: "🤢" },
  { label: "Skin Rash", emoji: "🔴" },
  { label: "Dizziness", emoji: "😵" },
  { label: "Difficulty Breathing", emoji: "😤" },
  { label: "Joint Pain", emoji: "🦴" },
  { label: "Fatigue", emoji: "😴" },
];

type TriageResult = {
  assessment: string;
  recommended_department: string;
  urgency_level: "routine" | "priority" | "emergency";
  advice: string;
  suggested_specialists: string[];
};

const urgencyConfig = {
  routine: { color: "bg-success text-success-foreground", icon: CheckCircle2, label: "Routine" },
  priority: { color: "bg-warning text-warning-foreground", icon: Clock, label: "Priority" },
  emergency: { color: "bg-destructive text-destructive-foreground", icon: AlertTriangle, label: "Emergency" },
};

export default function AITriage() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleAssess = async () => {
    if (selectedSymptoms.length === 0 && !additionalNotes.trim()) {
      toast.error("Please select at least one symptom or describe your condition.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-triage", {
        body: {
          symptoms: {
            selected: selectedSymptoms,
            additional: additionalNotes,
          },
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to process symptoms. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setAdditionalNotes("");
    setResult(null);
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-3xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" /> AI Symptom Pre-Assessment
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Answer a few questions to help us route you to the right department.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Symptom selection */}
              <div>
                <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
                  Select Your Symptoms
                </h2>
                <div className="flex flex-wrap gap-2">
                  {symptomCategories.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => toggleSymptom(s.label)}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${
                        selectedSymptoms.includes(s.label)
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-card text-foreground hover:border-primary/50"
                      }`}
                    >
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional notes */}
              <div>
                <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
                  Additional Details (Optional)
                </h2>
                <Textarea
                  placeholder="Describe any other symptoms, how long you've had them, severity..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleAssess}
                disabled={loading}
                size="lg"
                className="gradient-primary border-0 text-primary-foreground gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-5 w-5" /> Get Assessment
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                ⚠️ This is an AI-powered pre-assessment tool and NOT a medical diagnosis. Always consult a doctor for proper evaluation.
              </p>
            </motion.div>
          ) : (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              {/* Urgency badge */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-lg font-semibold text-foreground">Assessment Result</h2>
                  {(() => {
                    const conf = urgencyConfig[result.urgency_level];
                    return (
                      <Badge className={`${conf.color} text-sm px-3 py-1`}>
                        <conf.icon className="h-4 w-4 mr-1" /> {conf.label}
                      </Badge>
                    );
                  })()}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Assessment</p>
                    <p className="text-sm text-foreground">{result.assessment}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Recommended Department</p>
                    <Badge variant="secondary" className="text-sm">{result.recommended_department}</Badge>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Specialists</p>
                    <div className="flex flex-wrap gap-2">
                      {result.suggested_specialists.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-1">💡 Advice</p>
                    <p className="text-sm text-foreground">{result.advice}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link to="/schedule">
                  <Button className="gradient-primary border-0 text-primary-foreground gap-2">
                    Schedule Consultation <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                  <RotateCcw className="h-4 w-4" /> New Assessment
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                ⚠️ This AI assessment is for guidance only. Please consult with a medical professional for proper diagnosis and treatment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}

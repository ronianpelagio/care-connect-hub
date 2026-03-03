import { motion } from "framer-motion";
import { Video, FileText, Download, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const consultations = [
  {
    id: 1,
    doctor: "Dr. Maria Santos",
    specialty: "General Medicine",
    date: "Feb 28, 2026",
    time: "10:00 AM",
    status: "completed",
    hasTranscript: true,
    hasPrescription: true,
    duration: "25 min",
  },
  {
    id: 2,
    doctor: "Dr. Carlos Reyes",
    specialty: "Cardiology",
    date: "Mar 5, 2026",
    time: "2:30 PM",
    status: "upcoming",
    hasTranscript: false,
    hasPrescription: false,
    duration: "—",
  },
  {
    id: 3,
    doctor: "Dr. Ana Cruz",
    specialty: "Dermatology",
    date: "Feb 15, 2026",
    time: "11:00 AM",
    status: "completed",
    hasTranscript: true,
    hasPrescription: true,
    duration: "18 min",
  },
  {
    id: 4,
    doctor: "Dr. Jose Garcia",
    specialty: "Pediatrics",
    date: "Jan 20, 2026",
    time: "9:00 AM",
    status: "cancelled",
    hasTranscript: false,
    hasPrescription: false,
    duration: "—",
  },
];

const statusConfig = {
  completed: { color: "bg-success text-success-foreground", icon: CheckCircle2 },
  upcoming: { color: "bg-info text-info-foreground", icon: Clock },
  cancelled: { color: "bg-destructive/10 text-destructive", icon: XCircle },
};

export default function Consultations() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Consultations</h1>
          <p className="text-sm text-muted-foreground mt-1">View your past and upcoming consultation sessions.</p>
        </div>

        <div className="space-y-3">
          {consultations.map((c, i) => {
            const sConf = statusConfig[c.status as keyof typeof statusConfig];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-5 shadow-card"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Video className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{c.doctor}</p>
                      <p className="text-xs text-muted-foreground">{c.specialty}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.date} at {c.time} · {c.duration}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={sConf.color}>
                      <sConf.icon className="h-3 w-3 mr-1" />
                      {c.status}
                    </Badge>
                    {c.hasTranscript && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => toast.info("Transcript download started.")}
                      >
                        <Download className="h-3 w-3" /> Transcript
                      </Button>
                    )}
                    {c.hasPrescription && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-xs"
                        onClick={() => toast.info("Viewing prescription.")}
                      >
                        <FileText className="h-3 w-3" /> Prescription
                      </Button>
                    )}
                    {c.status === "upcoming" && (
                      <Button size="sm" className="gradient-primary border-0 text-primary-foreground gap-1 text-xs">
                        <Video className="h-3 w-3" /> Join
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

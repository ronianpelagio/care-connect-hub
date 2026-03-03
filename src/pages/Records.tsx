import { motion } from "framer-motion";
import { ClipboardList, FileText, Download, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const records = [
  {
    id: 1,
    date: "Feb 28, 2026",
    doctor: "Dr. Maria Santos",
    type: "Consultation Transcript",
    diagnosis: "Upper Respiratory Tract Infection",
    fileType: "txt",
  },
  {
    id: 2,
    date: "Feb 20, 2026",
    doctor: "Dr. Carlos Reyes",
    type: "Prescription Record",
    diagnosis: "Hypertension Management",
    fileType: "pdf",
  },
  {
    id: 3,
    date: "Feb 15, 2026",
    doctor: "Dr. Ana Cruz",
    type: "Consultation Transcript",
    diagnosis: "Allergic Dermatitis",
    fileType: "txt",
  },
  {
    id: 4,
    date: "Jan 10, 2026",
    doctor: "Dr. Jose Garcia",
    type: "Lab Results",
    diagnosis: "Routine Checkup",
    fileType: "pdf",
  },
];

export default function Records() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Medical Records</h1>
          <p className="text-sm text-muted-foreground mt-1">Securely stored electronic medical records.</p>
        </div>

        <div className="space-y-3">
          {records.map((rec, i) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm">{rec.type}</p>
                  <p className="text-xs text-muted-foreground">{rec.diagnosis}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <User className="h-3 w-3" /> {rec.doctor} · <Calendar className="h-3 w-3" /> {rec.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] uppercase">.{rec.fileType}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => toast.info(`Downloading ${rec.type}...`)}
                >
                  <Download className="h-3 w-3" /> Download
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

import { motion } from "framer-motion";
import { FileText, Pill, ShoppingCart, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Link } from "react-router-dom";

const prescriptions = [
  {
    id: 1,
    date: "Feb 28, 2026",
    doctor: "Dr. Maria Santos",
    medicines: ["Amoxicillin 500mg - 3x daily, 7 days", "Paracetamol 500mg - as needed"],
    status: "active",
    diagnosis: "Upper Respiratory Tract Infection",
  },
  {
    id: 2,
    date: "Feb 20, 2026",
    doctor: "Dr. Carlos Reyes",
    medicines: ["Losartan 50mg - 1x daily", "Aspirin 80mg - 1x daily"],
    status: "active",
    diagnosis: "Hypertension Management",
  },
  {
    id: 3,
    date: "Jan 10, 2026",
    doctor: "Dr. Ana Cruz",
    medicines: ["Cetirizine 10mg - 1x daily, 14 days"],
    status: "completed",
    diagnosis: "Allergic Dermatitis",
  },
];

export default function Prescriptions() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Prescriptions</h1>
          <p className="text-sm text-muted-foreground mt-1">Digital prescriptions from your consultations.</p>
        </div>

        <div className="space-y-4">
          {prescriptions.map((rx, i) => (
            <motion.div
              key={rx.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={rx.status === "active" ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                      {rx.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {rx.date}
                    </span>
                  </div>
                  <p className="font-semibold text-foreground">{rx.diagnosis}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <User className="h-3 w-3" /> {rx.doctor}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {rx.medicines.map((med, j) => (
                      <div key={j} className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm">
                        <Pill className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-foreground">{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 sm:flex-col">
                  <Button variant="outline" size="sm" className="gap-1 text-xs">
                    <FileText className="h-3 w-3" /> View PDF
                  </Button>
                  {rx.status === "active" && (
                    <Link to="/pharmacy">
                      <Button size="sm" className="gradient-primary border-0 text-primary-foreground gap-1 text-xs">
                        <ShoppingCart className="h-3 w-3" /> Order Medicine
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

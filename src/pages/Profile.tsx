import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function Profile() {
  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-2xl">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Your registered patient information.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground font-display">
              JD
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-foreground">Juan Dela Cruz</h2>
              <Badge className="bg-success text-success-foreground mt-1">Active Patient</Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: Mail, label: "Email", value: "juan.delacruz@email.com" },
              { icon: Phone, label: "Phone", value: "+63 912 345 6789" },
              { icon: MapPin, label: "Address", value: "123 Main St, Manila, PH" },
              { icon: Calendar, label: "Date of Birth", value: "January 15, 1990" },
              { icon: Shield, label: "Patient ID", value: "ECH-2026-00142" },
              { icon: User, label: "Blood Type", value: "O+" },
            ].map((info) => (
              <div key={info.label} className="rounded-lg bg-muted/50 p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <info.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{info.label}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{info.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

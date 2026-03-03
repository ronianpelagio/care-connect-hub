import { motion } from "framer-motion";
import { CalendarCheck, Video, FileText, Pill, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";

const upcomingAppointments = [
  { id: 1, doctor: "Dr. Maria Santos", specialty: "General Medicine", date: "Mar 5, 2026", time: "10:00 AM", status: "confirmed" },
  { id: 2, doctor: "Dr. Carlos Reyes", specialty: "Cardiology", date: "Mar 8, 2026", time: "2:30 PM", status: "pending" },
];

const recentPrescriptions = [
  { id: 1, medicine: "Amoxicillin 500mg", doctor: "Dr. Maria Santos", date: "Feb 28, 2026", status: "active" },
  { id: 2, medicine: "Losartan 50mg", doctor: "Dr. Carlos Reyes", date: "Feb 20, 2026", status: "completed" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Dashboard() {
  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Good morning, Juan 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your health overview.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Upcoming Appointments" value={2} icon={CalendarCheck} variant="primary" />
          <StatCard title="Total Consultations" value={12} icon={Video} variant="info" />
          <StatCard title="Active Prescriptions" value={3} icon={FileText} variant="success" />
          <StatCard title="Pending Orders" value={1} icon={Pill} variant="warning" />
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
          <Link to="/schedule">
            <div className="rounded-xl gradient-primary p-6 text-primary-foreground transition-transform hover:scale-[1.01]">
              <CalendarCheck className="h-8 w-8 mb-3 opacity-80" />
              <h3 className="font-display text-lg font-semibold">Schedule Consultation</h3>
              <p className="text-sm opacity-80 mt-1">Book a new appointment with your doctor.</p>
              <Button variant="secondary" size="sm" className="mt-4 gap-1">
                Book Now <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Link>
          <Link to="/pharmacy">
            <div className="rounded-xl bg-accent/10 border border-accent/20 p-6 text-foreground transition-transform hover:scale-[1.01]">
              <Pill className="h-8 w-8 mb-3 text-accent" />
              <h3 className="font-display text-lg font-semibold">Order Medicine</h3>
              <p className="text-sm text-muted-foreground mt-1">Purchase prescribed medicines online.</p>
              <Button variant="outline" size="sm" className="mt-4 gap-1">
                Browse <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Link>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Upcoming Appointments</h2>
            <Link to="/consultations" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Video className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{appt.doctor}</p>
                    <p className="text-xs text-muted-foreground">{appt.specialty}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{appt.date}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" /> {appt.time}
                    </p>
                  </div>
                  <Badge variant={appt.status === "confirmed" ? "default" : "secondary"} className={appt.status === "confirmed" ? "bg-success text-success-foreground" : ""}>
                    {appt.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Prescriptions */}
        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Prescriptions</h2>
            <Link to="/prescriptions" className="text-sm text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {recentPrescriptions.map((rx) => (
              <div key={rx.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10 text-success">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{rx.medicine}</p>
                    <p className="text-xs text-muted-foreground">{rx.doctor}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{rx.date}</p>
                  <Badge variant="secondary" className={rx.status === "active" ? "bg-success/10 text-success" : ""}>
                    {rx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}

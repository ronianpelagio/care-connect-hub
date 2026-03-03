import { motion } from "framer-motion";
import { BarChart3, Users, Pill, Stethoscope, TrendingUp, Calendar, Activity } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const consultationData = [
  { name: "Mon", count: 12 },
  { name: "Tue", count: 19 },
  { name: "Wed", count: 15 },
  { name: "Thu", count: 22 },
  { name: "Fri", count: 18 },
  { name: "Sat", count: 8 },
  { name: "Sun", count: 5 },
];

const departmentData = [
  { name: "General Medicine", value: 35, color: "hsl(174, 62%, 38%)" },
  { name: "Cardiology", value: 20, color: "hsl(205, 80%, 50%)" },
  { name: "Dermatology", value: 15, color: "hsl(36, 90%, 55%)" },
  { name: "Pediatrics", value: 18, color: "hsl(152, 60%, 42%)" },
  { name: "Other", value: 12, color: "hsl(200, 10%, 45%)" },
];

const revenueData = [
  { name: "Jan", revenue: 45000 },
  { name: "Feb", revenue: 52000 },
  { name: "Mar", revenue: 48000 },
  { name: "Apr", revenue: 61000 },
  { name: "May", revenue: 55000 },
  { name: "Jun", revenue: 67000 },
];

const topMedicines = [
  { name: "Amoxicillin 500mg", prescribed: 145, revenue: 1812 },
  { name: "Paracetamol 500mg", prescribed: 230, revenue: 690 },
  { name: "Losartan 50mg", prescribed: 98, revenue: 1764 },
  { name: "Cetirizine 10mg", prescribed: 120, revenue: 600 },
  { name: "Metformin 500mg", prescribed: 87, revenue: 1044 },
];

const commonDiagnoses = [
  { name: "Upper Respiratory Infection", count: 89 },
  { name: "Hypertension", count: 76 },
  { name: "Type 2 Diabetes", count: 54 },
  { name: "Allergic Rhinitis", count: 45 },
  { name: "Urinary Tract Infection", count: 38 },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Hospital Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of hospital operations and performance metrics.</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Patients" value={1247} icon={Users} variant="primary" />
          <StatCard title="This Week Consultations" value={99} icon={Stethoscope} variant="info" />
          <StatCard title="Pharmacy Revenue" value="₱67K" icon={TrendingUp} variant="success" />
          <StatCard title="Active Doctors" value={24} icon={Activity} variant="warning" />
        </motion.div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Consultation Trends */}
          <motion.div variants={item} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Weekly Consultations
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={consultationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(200, 10%, 45%)" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(200, 10%, 45%)" }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(174, 62%, 38%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Department Distribution */}
          <motion.div variants={item} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-semibold text-foreground mb-4">Department Distribution</h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={200}>
                <PieChart>
                  <Pie data={departmentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {departmentData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {departmentData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-xs">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-foreground">{d.name}</span>
                    <span className="text-muted-foreground ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Revenue Trend */}
        <motion.div variants={item} className="rounded-xl border border-border bg-card p-5 shadow-card">
          <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" /> E-Pharmacy Revenue Trend
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(160, 15%, 88%)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(200, 10%, 45%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(200, 10%, 45%)" }} tickFormatter={(v) => `₱${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => [`₱${value.toLocaleString()}`, "Revenue"]} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(152, 60%, 42%)" strokeWidth={2} dot={{ fill: "hsl(152, 60%, 42%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Tables Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Medicines */}
          <motion.div variants={item} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Pill className="h-4 w-4 text-primary" /> Most Prescribed Medicines
            </h2>
            <div className="space-y-3">
              {topMedicines.map((med, i) => (
                <div key={med.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{med.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">{med.prescribed}x</p>
                    <p className="text-[11px] text-muted-foreground">₱{med.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Common Diagnoses */}
          <motion.div variants={item} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <h2 className="font-display text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-info" /> Most Common Diagnoses
            </h2>
            <div className="space-y-3">
              {commonDiagnoses.map((diag) => (
                <div key={diag.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{diag.name}</span>
                    <span className="text-xs text-muted-foreground">{diag.count} cases</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${(diag.count / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

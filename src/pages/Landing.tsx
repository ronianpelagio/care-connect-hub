import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, CalendarCheck, Video, FileText, Pill, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";

const features = [
  { icon: CalendarCheck, title: "Smart Scheduling", desc: "Book consultations based on real-time doctor availability." },
  { icon: Video, title: "Online Consultations", desc: "Secure video consultations with transcript recording." },
  { icon: FileText, title: "E-Prescriptions", desc: "Digital prescriptions sent directly to the pharmacy." },
  { icon: Pill, title: "Medicine Ordering", desc: "Order prescribed medicines for pickup or delivery." },
  { icon: Shield, title: "Secure Records", desc: "All medical records encrypted and safely stored." },
  { icon: Activity, title: "Health Tracking", desc: "Monitor your appointments and health history." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-7 w-7 text-primary" />
            <span className="font-display text-xl font-bold text-foreground">EConsultCare</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16">
        <div className="gradient-hero">
          <div className="container grid min-h-[85vh] items-center gap-12 py-20 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold text-primary-foreground/80 mb-6">
                Hospital-Based Teleconsultation
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Healthcare,{" "}
                <span className="text-sidebar-primary">Reimagined</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-primary-foreground/70">
                Schedule consultations, receive digital prescriptions, and order medicine — all from one secure platform.
              </p>
              <div className="mt-8 flex gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="gradient-primary border-0 text-primary-foreground gap-2">
                    Enter Portal <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img
                src={heroImage}
                alt="Doctor and patient on video consultation"
                className="rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              A comprehensive digital healthcare ecosystem for patients and medical professionals.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-display text-sm font-semibold text-foreground">EConsultCare</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 EConsultCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

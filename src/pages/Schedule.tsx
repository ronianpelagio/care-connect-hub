import { useState } from "react";
import { motion } from "framer-motion";
import { CalendarCheck, Clock, User, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

const doctors = [
  { id: 1, name: "Dr. Maria Santos", specialty: "General Medicine", available: true, nextSlot: "Today, 3:00 PM" },
  { id: 2, name: "Dr. Carlos Reyes", specialty: "Cardiology", available: true, nextSlot: "Tomorrow, 9:00 AM" },
  { id: 3, name: "Dr. Ana Cruz", specialty: "Dermatology", available: false, nextSlot: "Mar 7, 10:30 AM" },
  { id: 4, name: "Dr. Jose Garcia", specialty: "Pediatrics", available: true, nextSlot: "Today, 4:30 PM" },
];

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
];

export default function Schedule() {
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      toast.error("Please select a doctor, date, and time.");
      return;
    }
    const doc = doctors.find(d => d.id === selectedDoctor);
    toast.success(`Appointment booked with ${doc?.name} on ${selectedDate} at ${selectedTime}`);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Schedule Consultation</h1>
          <p className="text-sm text-muted-foreground mt-1">Select a doctor and choose an available time slot.</p>
        </div>

        {/* Step 1: Select Doctor */}
        <div>
          <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
            Select Doctor
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => doc.available && setSelectedDoctor(doc.id)}
                disabled={!doc.available}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  selectedDoctor === doc.id
                    ? "border-primary bg-primary/5 shadow-card-hover"
                    : doc.available
                      ? "border-border bg-card shadow-card hover:shadow-card-hover"
                      : "border-border bg-muted opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={doc.available ? "default" : "secondary"} className={doc.available ? "bg-success text-success-foreground" : ""}>
                    {doc.available ? "Available" : "Unavailable"}
                  </Badge>
                  <p className="text-[11px] text-muted-foreground mt-1">{doc.nextSlot}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Select Date */}
        {selectedDoctor && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
              Select Date
            </h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="rounded-lg border border-input bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </motion.div>
        )}

        {/* Step 3: Select Time */}
        {selectedDate && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="font-display text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
              Select Time Slot
            </h2>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    selectedTime === slot
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/50"
                  }`}
                >
                  <Clock className="inline h-3.5 w-3.5 mr-1" />
                  {slot}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Confirm */}
        {selectedTime && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Button onClick={handleBook} size="lg" className="gradient-primary border-0 text-primary-foreground gap-2">
              <CalendarCheck className="h-5 w-5" /> Confirm Appointment
            </Button>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}

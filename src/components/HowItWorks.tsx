import { motion } from "framer-motion";
import { Ticket, Brain, Search, BarChart3, AlertTriangle, Bell } from "lucide-react";

const steps = [
  { icon: Ticket, label: "Ticket Created" },
  { icon: Brain, label: "AI Processing" },
  { icon: Search, label: "Vector Retrieval" },
  { icon: BarChart3, label: "Hybrid ML Scoring" },
  { icon: AlertTriangle, label: "Escalation Trigger" },
  { icon: Bell, label: "Notification Sent" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-muted/30 py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          How It <span className="text-gradient">Works</span>
        </h2>
        <p className="mt-4 text-muted-foreground">From ticket to resolution in six intelligent steps.</p>
      </motion.div>

      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute left-0 right-0 top-10 hidden h-0.5 bg-border lg:block" />

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-background shadow-card">
                <s.icon className="h-8 w-8 text-accent" />
              </div>
              <span className="text-xs font-bold text-accent">Step {i + 1}</span>
              <p className="mt-1 text-sm font-medium">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;

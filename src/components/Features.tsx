import { motion } from "framer-motion";
import { Brain, Search, Zap, Activity, ShieldCheck, FileText } from "lucide-react";

const features = [
  { icon: Brain, title: "AI Risk Prediction", desc: "Predict SLA breaches using LLM reasoning." },
  { icon: Search, title: "Vector Search Intelligence", desc: "Retrieve similar historical incidents using semantic search." },
  { icon: Zap, title: "Automated Escalation", desc: "Automatically escalate high-risk tickets." },
  { icon: Activity, title: "Real-time Monitoring", desc: "Track ticket risk in real time." },
  { icon: ShieldCheck, title: "Admin Control", desc: "Admins can override AI decisions." },
  { icon: FileText, title: "Audit Logging", desc: "Track AI decision history." },
];

const Features = () => (
  <section id="features" className="py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          Everything you need to <span className="text-gradient">prevent breaches</span>
        </h2>
        <p className="mt-4 text-muted-foreground">Powerful features built for modern SLA management.</p>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
           
            className="group   p-6 "
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <f.icon className="h-6 w-6 text-accent" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
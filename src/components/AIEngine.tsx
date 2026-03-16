import { motion } from "framer-motion";
import { Cpu,Brain, MessageSquare, Database, Code2, ArrowRight, AlertTriangle, BarChart3 } from "lucide-react";

const blocks = [
  { 
    icon: Cpu, 
    title: "LangGraph", 
    desc: "Orchestration engine for multi-step AI workflows" 
  },
  { 
    icon: MessageSquare, 
    title: "Gemini LLM", 
    desc: "Advanced reasoning for risk assessment" 
  },
  { 
    icon: Code2, 
    title: "SentenceTransformer", 
    desc: "Embedding model for ticket similarity" 
  },
  { 
    icon: Database, 
    title: "Pinecone", 
    desc: "Vector database for semantic incident search" 
  },
  { 
    icon: Brain, 
    title: "ML Prediction Model", 
    desc: "Machine learning model predicts SLA breach probability using ticket urgency and historical patterns" 
  },
  { 
    icon: BarChart3, 
    title: "Risk Engine", 
    desc: "Hybrid scoring combining ML predictions and rule-based signals" 
  },
  { 
    icon: AlertTriangle, 
    title: "SLA Breach Alerts", 
    desc: "Proactive alerts and recommendations before violations occur",
    highlight: true 
  }
];

const AIEngine = () => (
  <section id="ai-engine" className="py-20 sm:py-28">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">
          The <span className="text-gradient">AI Engine</span> Behind the Scenes
        </h2>
        <p className="mt-4 text-muted-foreground">
          Production-grade AI architecture for reliable SLA predictions.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
        {blocks.map((b, i) => (
          <div key={b.title} className="flex items-center">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              whileHover={{ y: -4 }}
              className={`w-56 rounded-2xl border p-5 transition-shadow 
              ${b.highlight 
                ? "border-primary bg-primary/10 shadow-lg" 
                : "border-border bg-card shadow-card hover:shadow-card-hover"
              }`}
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <b.icon className={`h-5 w-5 ${b.highlight ? "text-primary" : "text-accent"}`} />
              </div>

              <h3 className="text-sm font-bold">{b.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{b.desc}</p>
            </motion.div>

            {i < blocks.length - 1 && (
              <ArrowRight className="mx-2 hidden h-5 w-5 text-muted-foreground/40 sm:block" />
            )}

          </div>
        ))}
      </div>

    </div>
  </section>
);

export default AIEngine;
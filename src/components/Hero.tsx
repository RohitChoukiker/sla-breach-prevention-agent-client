
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => (
  <section className="relative overflow-hidden bg-gradient-bg py-20 sm:py-28 lg:py-36">
    
    {/* Decorative blobs */}
    <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-foreground">
            <Zap className="h-4 w-4 text-accent" />
            AI-Powered SLA Intelligence
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Prevent SLA Breaches{" "}
            <span className="text-gradient">Before They Happen</span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
            SLA Sentinel combines <strong>LLM reasoning</strong>, 
            <strong> vector similarity search</strong>, and a 
            <strong> machine learning prediction engine </strong> 
            to detect SLA risks early and trigger proactive escalation 
            before incidents impact customers.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild variant="default" size="lg">
              <Link to="/login">
                Login <ArrowRight className="ml-1 h-5 w-5" />
              </Link>
            </Button>
          </div>

        </motion.div>

      </div>
    </div>
  </section>
);

export default Hero;

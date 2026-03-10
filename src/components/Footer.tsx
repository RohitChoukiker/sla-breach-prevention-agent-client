import { Shield } from "lucide-react";

const columns = [
  { title: "Product", links: ["Features", "Roadmap"] },
  { title: "Company", links: ["About", "Careers"] },

  { title: "Legal", links: ["Privacy", "Terms"] },
];

const Footer = () => (
  <footer className="border-t border-border bg-muted/30 pt-10 pb-6 mt-auto">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-y-10 gap-x-8 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-2">
                      <img src="/icon.png" alt="SLA Sentinel Logo" className="h-8 w-8" />
              <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>
                <span style={{ color: '#FFC107' }}>SLA</span> Sentinel
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">AI-Powered SLA Breach Prevention Platform</p>
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title} className="flex flex-col gap-2">
            <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>
            <ul className="flex flex-col gap-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">
        <p className="text-sm text-muted-foreground">© 2026 SLA Sentinel. All rights reserved.</p>
        <div className="flex flex-row gap-6">
          {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
            <a key={s} href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {s}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

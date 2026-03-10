
const columns = [
  {
    title: "Product",
    links: ["Features", "AI Engine"],
  },
  {
    title: "Company",
    links: ["About"],
  },
];

const linkTargets: Record<string, string> = {
  Features: "/landing#features",
  "AI Engine": "/landing#ai-engine",
  About: "/landing#about",
};

const Footer = () => (
  <footer className="border-t border-border bg-muted/30 pt-12 pb-8 mt-auto">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

      <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

        {/* Logo Section */}
        <div id="about">
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="SLA Sentinel Logo" className="h-9 w-9" />

            <span className="text-xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              <span style={{ color: "#FFC107" }}>SLA</span> Sentinel
            </span>
          </div>

          <p className="mt-3 text-sm text-muted-foreground max-w-xs">
            AI-powered platform to predict and prevent SLA breaches before they impact customers.
          </p>
        </div>

        {/* Footer Columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-sm font-semibold">{col.title}</h4>

            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href={linkTargets[link] || "/landing"}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

      </div>

      {/* Bottom Footer */}
      <div className="mt-10 flex flex-col items-center justify-center gap-6 border-t border-border pt-6 sm:flex-row">

        <p className="text-sm text-muted-foreground">
          © 2026 SLA Sentinel. All rights reserved.
        </p>

       

      </div>
    </div>
  </footer>
);

export default Footer;
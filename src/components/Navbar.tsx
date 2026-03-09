import { NavLink } from "./NavLink";
import { Shield } from "lucide-react";

const navItems = [
  { label: "Home", to: "/landing" },
  { label: "Features", to: "#features" },
  { label: "How It Works", to: "#how-it-works" },
  { label: "Login", to: "/login" },
];

const Navbar = () => (
  <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-accent" />
        <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>SLA Sentinel</span>
      </div>
      <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              className="text-sm  text-muted-foreground hover:text-foreground transition-colors"
              activeClassName="text-foreground font-semibold"
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

export default Navbar;

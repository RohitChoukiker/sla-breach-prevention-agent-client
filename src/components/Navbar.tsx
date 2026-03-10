
import { useState } from "react";
import { NavLink } from "./NavLink";
import { Shield, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", to: "/landing" },
  { label: "Features", to: "#features" },
  { label: "How It Works", to: "#how-it-works" },
  { label: "Login", to: "/login" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="SLA Sentinel Logo" className="h-8 w-8" />
          <span className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}> <span style={{ color: '#FFC107' }}>SLA</span> Sentinel</span>
        </div>
        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.to}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground font-semibold"
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-accent"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>
      {/* Mobile nav */}
      {open && (
        <div className="md:hidden bg-background border-t border-border px-4 pb-4">
          <ul className="flex flex-col gap-3 mt-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.to}
                  className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;

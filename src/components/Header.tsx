import { useState } from "react";
import { navLinks } from "../data/site.ts";
import { Logo } from "./Logo.tsx";
import { ThemeToggle } from "./ThemeToggle.tsx";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="wrap header__bar">
        <a
          href="/"
          className="header__home"
          aria-label="Tu Nuevo Hogar, inicio"
        >
          <Logo />
        </a>

        <ThemeToggle />

        <button
          type="button"
          className="header__toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Cerrar" : "Menú"}
        </button>

        <nav
          id="menu"
          className={open ? "header__nav is-open" : "header__nav"}
          aria-label="Principal"
          onClick={(e) => {
            if (e.target instanceof HTMLAnchorElement) setOpen(false);
          }}
        >
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="header__link">
              {link.label}
            </a>
          ))}
          <a href="/contacto" className="btn btn--pink header__cta">
            Agenda una cita
          </a>
        </nav>
      </div>
    </header>
  );
}

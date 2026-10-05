import { navLinks } from "../data/site.ts";
import { Logo } from "./Logo.tsx";

export function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="wrap footer__grid">
        <div className="footer__logo">
          <Logo />
        </div>
        <nav className="footer__nav" aria-label="Pie de página">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="/contacto">Contacto</a>
          <a href="/preguntas">Preguntas frecuentes</a>
        </nav>
        <p className="footer__legal">
          Las ilustraciones son representativas. Precios, medidas y promociones
          pueden cambiar sin previo aviso; confirma la información vigente en el
          centro de ventas.
          <br />© 2026 Tu Nuevo Hogar
        </p>
      </div>
    </footer>
  );
}

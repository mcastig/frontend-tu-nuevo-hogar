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
          Esto es un proyecto para un curso de IA, no un sitio real de bienes
          raíces. Todo el texto, imágenes y marcas son ficticios y no
          representan a ninguna empresa real.
          <br />© 2026 Tu Nuevo Hogar
        </p>
      </div>
    </footer>
  );
}

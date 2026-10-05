import { useState } from 'react'
import './App.css'
import { Contact } from './components/Contact.tsx'
import { Credits } from './components/Credits.tsx'
import { Faq } from './components/Faq.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Location } from './components/Location.tsx'
import { Projects } from './components/Projects.tsx'
import { Promotions } from './components/Promotions.tsx'
import { Team } from './components/Team.tsx'
import { Testimonials } from './components/Testimonials.tsx'
import { WhatsAppButton } from './components/WhatsApp.tsx'
import type { ProjectId } from './data/site.ts'

function App() {
  // Condominium picked from a project card; preselects it in the contact form.
  const [interest, setInterest] = useState<ProjectId | ''>('')

  return (
    <>
      <a href="#proyectos" className="skip">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <Projects onAskAbout={setInterest} />
        <Promotions />
        <Credits />
        <Team />
        <Testimonials />
        <Location />
        <Contact interest={interest} onInterestChange={setInterest} />
        <Faq />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default App

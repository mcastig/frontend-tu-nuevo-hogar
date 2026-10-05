import { team } from '../data/site.ts'
import { Avatar } from './Avatar.tsx'

export function Team() {
  return (
    <section id="equipo" className="section section--sky">
      <div className="wrap">
        <header className="section__head">
          <p className="section__label">Equipo</p>
          <h2 className="section__title">Quién te abre la puerta</h2>
          <p className="section__lead">
            Seis personas llevan tu compra de principio a fin. Aquí está a quién preguntarle qué.
          </p>
        </header>

        <ul className="team">
          {team.map((member) => (
            <li key={member.name} className="member">
              <div className={`member__door member__door--${member.color}`}>
                <Avatar {...member.avatar} />
              </div>
              <h3 className="member__name">{member.name}</h3>
              <p className="member__role">{member.role}</p>
              <p className="member__ask">{member.askAbout}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

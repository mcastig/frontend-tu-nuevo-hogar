import { contact } from '../data/site.ts'

export function WhatsAppIcon() {
  return (
    <svg className="wa-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.3A9.5 9.5 0 1 0 12 2.5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.7 7.4c-.5 1 .1 3 2.1 5s4 2.7 5 2.2l.8-1.3-1.9-1.2-.9.8c-.7-.3-2.2-1.8-2.5-2.5l.8-.9-1.2-1.9z"
        fill="currentColor"
      />
    </svg>
  )
}

// Opens a WhatsApp chat with the bot, with the greeting already typed.
export function WhatsAppButton() {
  return (
    <a className="wa-float" href={contact.whatsappHref} target="_blank" rel="noreferrer">
      <WhatsAppIcon />
      <span className="wa-float__text">
        WhatsApp
        <small>Agenda tu visita</small>
      </span>
    </a>
  )
}

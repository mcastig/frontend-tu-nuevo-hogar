import type { RefObject } from 'react'
import { privacyNotice } from '../data/site.ts'
import { closeOnBackdropClick } from './dialog.ts'

type PrivacyNoticeProps = {
  ref: RefObject<HTMLDialogElement | null>
}

export function PrivacyNotice({ ref }: PrivacyNoticeProps) {
  return (
    <dialog
      ref={ref}
      className="confirm privacy"
      aria-labelledby="privacy-title"
      onClick={closeOnBackdropClick}
    >
      <h3 id="privacy-title" className="confirm__title">
        Aviso de privacidad
      </h3>
      <p className="privacy__updated">Última actualización: {privacyNotice.updated}</p>

      {privacyNotice.sections.map((section) => (
        <section key={section.title} className="privacy__section">
          <h4>{section.title}</h4>
          <p>{section.body}</p>
        </section>
      ))}

      <div className="confirm__actions">
        <button type="button" className="btn btn--indigo" onClick={() => ref.current?.close()}>
          Cerrar aviso
        </button>
      </div>
    </dialog>
  )
}

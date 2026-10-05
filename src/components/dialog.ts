import type { MouseEvent } from 'react'

// A click on a modal <dialog>'s backdrop targets the element itself; a click inside targets its children.
export function closeOnBackdropClick(event: MouseEvent<HTMLDialogElement>) {
  if (event.target === event.currentTarget) event.currentTarget.close()
}

import { KeyboardEvent } from 'react'

export const focusNextInput = (target: EventTarget) => {
  if (target instanceof HTMLInputElement && target.form) {
    const { form } = target
    const elements = Array.from(form.elements)
    const index = elements.indexOf(target)
    const nextInput = elements[index + 1]
    if (nextInput instanceof HTMLElement) {
      nextInput.focus()
    }
  }
}

export const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
  if (event.key === 'Enter') {
    focusNextInput(event.target)

    event.preventDefault()
    event.stopPropagation()
  }
}

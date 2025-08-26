import { useEffect, useState } from 'react'
import { Maybe } from 'types/graphql'

type InteractionProps = {
  selector: string
  onMount?: (DOMElement: HTMLElement) => any
  onUnmount?: (DOMElement: HTMLElement) => any
}

const useDOMInteraction = ({
  selector,
  onMount,
  onUnmount,
}: InteractionProps) => {
  const [DOMElement, setDOMElement] = useState<Maybe<HTMLElement>>()

  useEffect(() => {
    const interactElement = () => {
      const button = document.querySelector(selector) as HTMLElement
      button && setDOMElement(button)
      button && onMount && onMount(button)
    }

    interactElement()

    const observer = new MutationObserver(interactElement)
    observer.observe(document.body, { childList: true })
    document.addEventListener('DOMNodeInserted', interactElement) // for older browsers

    //on component unmount
    return function cleanup() {
      DOMElement && onUnmount && onUnmount(DOMElement)

      observer.disconnect()
      document.removeEventListener('DOMNodeInserted', interactElement)
    }
  }, [DOMElement])

  return { DOMElement }
}

const useHideElement = (selector: string) => {
  useDOMInteraction({
    selector,
    onMount: (el) => (el.style.display = 'none'),
    onUnmount: (el) => (el.style.display = ''),
  })
}

const useMoveElementY = (selector: string, y: string | number) => {
  useDOMInteraction({
    selector,
    onMount: (el) => (el.style.transform = `translateY(${y}px)`),
    onUnmount: (el) => (el.style.transform = `translateY(-${y}px)`),
  })
}

const useMoveElementLeft = (selector: string, left: number) => {
  useDOMInteraction({
    selector,
    onMount: (el) => (el.style.left = `${left}px`),
    onUnmount: (el) => (el.style.left = ''),
  })
}

export {
  useDOMInteraction,
  useHideElement,
  useMoveElementY,
  useMoveElementLeft,
}

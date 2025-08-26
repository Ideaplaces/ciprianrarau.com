// Source: https://adamlynch.com/flexible-data-tables-with-css-grid/
import { useEffect } from 'react'

const min = 100
// The max (fr) values for grid-template-columns
const columnTypeToRatioMap = {
  numeric: 1,
  'text-short': 1,
  'text-long': 2,
}

const columns: Array<any> = []
let headerBeingResized: Record<string, any> | null

// The next three functions are mouse event callbacks

// Where the magic happens. I.e. when they're actually resizing
const onMouseMove = (e: any, table: HTMLTableElement) =>
  requestAnimationFrame(() => {
    // Calculate the desired width
    const horizontalScrollOffset = document.documentElement.scrollLeft
    const leftOfTableXOffset = table.getBoundingClientRect().x - 40
    const width =
      horizontalScrollOffset +
      e.clientX -
      leftOfTableXOffset -
      headerBeingResized?.offsetLeft

    // Update the column object with the new size value
    const column = columns.find(({ header }) => header === headerBeingResized)
    if (column) {
      column.size = Math.max(min, width) + 'px' // Enforce our minimum
    }

    // For the other headers which don't have a set width, fix it to their computed width
    columns.forEach((column) => {
      if (column?.size.startsWith('minmax')) {
        // isn't fixed yet (it would be a pixel value otherwise)
        column.size = parseInt(column.header.clientWidth, 10) + 'px'
      }
    })

    /* 
    Update the column sizes
    Reminder: grid-template-columns sets the width for all columns in one value
  */
    table.style.gridTemplateColumns = columns.map(({ size }) => size).join(' ')
  })

// Clean up event listeners, classes, etc.
const onMouseUp = (table: HTMLTableElement) => {
  window.removeEventListener('mousemove', (e) => onMouseMove(e, table))
  window.removeEventListener('mouseup', () => onMouseUp(table))
  headerBeingResized?.classList.remove('header--being-resized')
  headerBeingResized = null
}

// Get ready, they're about to resize
const initResize = (target: EventTarget, table: HTMLTableElement) => {
  headerBeingResized = <HTMLElement>(<HTMLElement>target).parentNode
  window.addEventListener('mousemove', (e) => onMouseMove(e, table))
  window.addEventListener('mouseup', () => onMouseUp(table))
  headerBeingResized?.classList.add('header--being-resized')
}

// Let's populate that columns array and add listeners to the resize handles
const useFlexTable = () => {
  useEffect(() => {
    const table = document.querySelector('table')

    document.querySelectorAll('th').forEach((header) => {
      const max =
        columnTypeToRatioMap[
          header.dataset.type as keyof typeof columnTypeToRatioMap
        ] + 'fr'
      columns.push({
        header,
        // The initial size value for grid-template-columns:
        size: `minmax(${min}px, ${max})`,
      })
      header
        .querySelector('.resize-handle')
        ?.addEventListener(
          'mousedown',
          ({ target }) => target && table && initResize(target, table)
        )
    })
  }, [])
}

export default useFlexTable

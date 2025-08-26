export default (() => {
  try {
    const january = new Date(9e8)
    const english = new Intl.DateTimeFormat('en', { month: 'long' })
    return english.format(january) === 'January'
  } catch (_e) {
    return false
  }
})()

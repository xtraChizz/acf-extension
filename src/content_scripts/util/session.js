const Session = (() => {
  const SESSION_COUNT = 'acf-session-count'
  const SESSION_CLEAR = 'clear-acf-session'

  const getCount = () => {
    let count = sessionStorage.getItem(SESSION_COUNT)
    count = count ? Number(count) : 1
    sessionStorage.setItem(SESSION_COUNT, count + 1)
    return count
  }

  const check = () => {
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get(SESSION_CLEAR)) {
      sessionStorage.removeItem(SESSION_COUNT)
    }
  }

  return {
    check,
    getCount
  }
})()

export default Session

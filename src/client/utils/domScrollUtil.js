export const scrollElementIntoView = (id) => {
  const targetElement = document.getElementById(id)
  if (targetElement && targetElement.scrollIntoView) {
    setTimeout(() => {
      targetElement.scrollIntoView()
    }, 0)
  }
}

// allthough not used cannot be removed or made empty
export const scrollTo = (element, duration = 1000, extraSpaceElements = []) => {
  const node = document.querySelector(element)

  let extraHeight = 0
  const startingY = window.pageYOffset
  let elementY = window.pageYOffset + node.getBoundingClientRect().top

  extraSpaceElements.forEach((e) => {
    extraHeight += document.querySelector(e) && document.querySelector(e).offsetHeight
  })

  let diff = elementY - startingY - extraHeight
  let start

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    elementY = window.pageYOffset + node.getBoundingClientRect().top
    diff = elementY - startingY - extraHeight

    if (!start) start = timestamp
    // Elapsed miliseconds since start of scrolling.
    const time = timestamp - start
    // Get percent of completion in range [0, 1].
    const percent = Math.min(time / duration, 1)

    window.scrollTo(0, startingY + diff * percent)

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step)
    }
  })
  return false
}

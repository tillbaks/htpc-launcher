/**
 * A container that has children with tabindex can be focused with the exported methods
 */

/**
 * Gets keyboard-focusable elements within a specified element
 * @param {HTMLElement} [element=document] element
 * @returns {Array}
 */
export function getKeyboardFocusableElements(element = document) {
  return [
    ...element.querySelectorAll(
      'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
    ),
  ].filter((el) => !el.hasAttribute("disabled"));
}

export function focusHorizontal({
  currentFocus,
  focusable,
  direction = "left",
}) {
  const candidates = [];
  const currentWidth = currentFocus.offsetHeight;
  const currentLeft = currentFocus.offsetTop;
  const currentRight = currentFocus.offsetTop + currentWidth;
  for (const sibling of focusable) {
    if (sibling === currentFocus) continue;
    const siblingLeft = sibling.offsetTop;
    const siblingRight = sibling.offsetTop + sibling.offsetHeight;
    const overlap =
      Math.max(
        Math.min(currentRight, siblingRight) -
          Math.max(currentLeft, siblingLeft)
      ) / currentWidth;
    if (overlap > 0) {
      const offsetDifference = currentFocus.offsetLeft - sibling.offsetLeft;
      const isAbove = offsetDifference > 0;
      if (
        (!isAbove && direction === "right") ||
        (isAbove && direction === "left")
      ) {
        candidates.push({
          sibling,
          overlap,
          offsetDifference: Math.abs(offsetDifference),
        });
      }
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      const overlapDiff = b.overlap - a.overlap;
      if (overlapDiff !== 0) return overlapDiff;

      const closest = a.offsetDifference - b.offsetDifference;
      if (closest !== 0) return closest;

      return a.sibling.offsetLeft - b.sibling.offsetLeft;
    });
    candidates[0].sibling.focus();
  }
}

export function focusVertical({ currentFocus, focusable, direction = "down" }) {
  const candidates = [];
  const currentWidth = currentFocus.offsetWidth;
  const currentLeft = currentFocus.offsetLeft;
  const currentRight = currentFocus.offsetLeft + currentWidth;
  for (const sibling of focusable) {
    if (sibling === currentFocus) continue;
    const siblingLeft = sibling.offsetLeft;
    const siblingRight = sibling.offsetLeft + sibling.offsetWidth;
    const overlap =
      Math.max(
        Math.min(currentRight, siblingRight) -
          Math.max(currentLeft, siblingLeft)
      ) / currentWidth;
    if (overlap > 0) {
      const offsetDifference = currentFocus.offsetTop - sibling.offsetTop;
      const isAbove = offsetDifference > 0;
      if (
        (!isAbove && direction === "down") ||
        (isAbove && direction === "up")
      ) {
        candidates.push({
          sibling,
          overlap,
          offsetDifference: Math.abs(offsetDifference),
        });
      }
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      const overlapDiff = b.overlap - a.overlap;
      if (overlapDiff !== 0) return overlapDiff;

      const closest = a.offsetDifference - b.offsetDifference;
      if (closest !== 0) return closest;

      return a.sibling.offsetLeft - b.sibling.offsetLeft;
    });
    candidates[0].sibling.focus();
  }
}

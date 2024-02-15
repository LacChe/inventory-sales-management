/**
 * Generates a unique identifier.
 *
 * @return {string} The generated unique identifier
 */
export function generateUID() {
  let firstPart = (Math.random() * 46656) | 0;
  let secondPart = (Math.random() * 46656) | 0;
  firstPart = ("000" + firstPart.toString(36)).slice(-3);
  secondPart = ("000" + secondPart.toString(36)).slice(-3);
  return firstPart + secondPart;
}

export function generateRandomHexColor(seed) {
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 33) ^ seed.charCodeAt(i);
  }
  hash = hash >>> 0;
  const hexColor = "#" + (hash & 0xffffff).toString(16).padStart(6, "0");
  return hexColor;
}

export function getContrastingHexColor(hexColor) {
  if (
    !hexColor ||
    typeof hexColor !== "string" ||
    !/^#[0-9A-Fa-f]{6}$/.test(hexColor)
  ) {
    throw new Error("Invalid hexColor input");
  }
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Decide on contrasting color
  const contrastingColor = luminance > 0.5 ? "#000000" : "#FFFFFF";
  return contrastingColor;
}

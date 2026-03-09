export function lightenColor(hex, amount = 0.4) {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.round((num >> 16) + (255 - (num >> 16)) * amount));
  const g = Math.min(255, Math.round(((num >> 8) & 0xff) + (255 - ((num >> 8) & 0xff)) * amount));
  const b = Math.min(255, Math.round((num & 0xff) + (255 - (num & 0xff)) * amount));
  return `rgb(${r}, ${g}, ${b})`;
}
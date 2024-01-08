function djb2(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
      hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

export function generateRandomHexColor(seed) {
    const hash = djb2(seed);
    const hexColor = '#' + (hash & 0xFFFFFF).toString(16).padStart(6, '0');
    return hexColor;
}

export function getContrastingHexColor(hexColor) {
  // Convert hex to RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  // Decide on contrasting color
  const contrastingColor = luminance > 0.5 ? '#000000' : '#FFFFFF';
  return contrastingColor;
}

export function fillProdValFromInv(prod, inventoryData) {
  if(!prod || !prod.inventory_items || !inventoryData) return prod;
    Object.keys(prod).forEach((field) => {
    if(prod[field] === '' && (field === 'name_en' || field === 'name_cn' || field === 'size')) {
        const dataFromInventory = inventoryData.filter(filterItem => filterItem.id === Object.keys(prod.inventory_items)[0])[0];
        prod[field] = dataFromInventory ? dataFromInventory[field] : prod[field];
    }
  })
  return prod;
}
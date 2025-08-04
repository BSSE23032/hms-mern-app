
export function setItemWithExpiry(key, value, time_limit) {
  const now = new Date();

  const item = {
    value,
    expiry: now.getTime() + time_limit, 
  };

  localStorage.setItem(key, JSON.stringify(item));
}

export function getItemWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);

    if (!item.expiry || Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (err) {
    console.error("Failed to parse localStorage item:", err);
    localStorage.removeItem(key); 
    return null;
  }
}

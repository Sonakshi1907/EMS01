export const getFromStorage = (key) => {
  const data = localStorage.getItem(key);

  if (!data) {
    return null;
  }

  return JSON.parse(data);
};

export const saveToStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const removeFromStorage = (key) => {
  localStorage.removeItem(key);
};

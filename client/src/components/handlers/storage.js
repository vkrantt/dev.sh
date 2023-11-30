export const set = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const get = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

export const remove = (key) => {
  return localStorage.removeItem(key);
};

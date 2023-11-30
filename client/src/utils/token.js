export function getToken() {
  return JSON.parse(localStorage.getItem("kienote_token"));
}

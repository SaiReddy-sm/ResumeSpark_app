export function isRequired(value) {
  return value.trim() !== "";
}

export function isEmail(value) {
  return value.includes("@") && value.includes(".");
}
export function capitalize(str: string) {
  return str[0].toUpperCase() + str.toLowerCase().slice(1).replace(/_/gi, " ");
}

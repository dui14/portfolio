export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

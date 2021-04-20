export function addSpaces(str: string, count: number): string {
  let spaces = '';
  while (count) {
    spaces += '  ';
    count--;
  }
  return spaces + str;
}

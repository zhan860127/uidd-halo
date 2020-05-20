export function randomString(alphabet: string, length: number): string {
  return Array(length)
    .fill(0)
    .map(() => alphabet[Math.floor(alphabet.length * Math.random())])
    .join('');
}

export function randomFilename() {
  return `${new Date().toISOString()}-${randomString('1234567890', 6)}`;
}

export function newChildToken(): string {
  return randomString('QWERTYUIOPASDFGHJKLZXCVBNM', 16);
}

export function randomName() {
  return `${new Date().getTime()}_${randomString('1234567890', 6)}`;
}

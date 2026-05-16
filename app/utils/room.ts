const ROOM_CODE_RE = /^[A-Za-z0-9_-]{4,64}$/;

export function isValidRoomCode(s: string): boolean {
  return ROOM_CODE_RE.test(s);
}

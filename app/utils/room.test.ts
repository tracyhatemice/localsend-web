import { expect, test } from "vitest";
import { isValidRoomCode } from "./room";

test("accepts valid codes", () => {
  expect(isValidRoomCode("abcd")).toBe(true);
  expect(isValidRoomCode("ABC-123_xyz")).toBe(true);
  expect(isValidRoomCode("a".repeat(64))).toBe(true);
  expect(isValidRoomCode("a-_0Z")).toBe(true);
});

test("rejects too short", () => {
  expect(isValidRoomCode("")).toBe(false);
  expect(isValidRoomCode("abc")).toBe(false);
});

test("rejects too long", () => {
  expect(isValidRoomCode("a".repeat(65))).toBe(false);
});

test("rejects invalid chars", () => {
  expect(isValidRoomCode("abc d")).toBe(false);
  expect(isValidRoomCode(" abcd")).toBe(false);
  expect(isValidRoomCode("abcd ")).toBe(false);
  expect(isValidRoomCode("abc.def")).toBe(false);
  expect(isValidRoomCode("abc/def")).toBe(false);
  expect(isValidRoomCode("abc:def")).toBe(false);
});

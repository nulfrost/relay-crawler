import { expect } from "@std/expect";
import { getDateTimeInFutureHours } from "../future.ts";

Deno.test("should error if hour is less than 0", () => {
  expect(() => getDateTimeInFutureHours(-1)).toThrow();
});

Deno.test("should add one hour to current date and time", () => {
  const oneHourFromNow = getDateTimeInFutureHours(1)
  expect(getDateTimeInFutureHours(1)).toBe(oneHourFromNow)
});

Deno.test("should add 12 hours to current date and time", () => {
  const twelveHoursFromNow = getDateTimeInFutureHours(12)
  expect(getDateTimeInFutureHours(12)).toBe(twelveHoursFromNow)
});

Deno.test("should add 24 hours to current date and time", () => {
  const twelveHoursFromNow = getDateTimeInFutureHours(24)
  expect(getDateTimeInFutureHours(24)).toBe(twelveHoursFromNow)
});

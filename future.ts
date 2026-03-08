// helper to return the next scheduled run in X hours from when the message is sent
export function getDateTimeInFutureHours(hoursToAdd: number) {
  if (hoursToAdd < 0) throw new Error("hour should be greater than or equal to zero")
  return Temporal.PlainDateTime.from(
    Temporal.Now.plainDateTimeISO("America/New_York"),
  )
    .add({ hours: hoursToAdd }).toLocaleString();
}

/**
 * if i just have this in `helpers.ts` and try to import it into a test, the test will
 * complain about other functions that rely on environment variables..? should figure this
 * out. weird to have this in its own file
 */

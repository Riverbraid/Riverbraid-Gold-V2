export const PETAL = "Gold-V2";
export const INVARIANT = "GOLD_V2_STATIONARY";
export function verify(input) {
  if (!input || typeof input !== "object") {
    return {
      pass: false,
      stationary: false,
      signal: "gold-v2:INVALID_INPUT",
      reason: "input must be an object"
    };
  }
  const stationary =
    input.repo === "Riverbraid-Gold-V2" &&
    input.petal === "Gold-V2" &&
    input.ring === 1 &&
    input.invariant === "GOLD_V2_STATIONARY";
  return {
    pass: true,
    stationary,
    signal: stationary ? "gold-v2:STATIONARY" : "gold-v2:DRIFT",
    reason: stationary
      ? "Stationary fields match declared petal identity"
      : "One or more stationary fields drift from declaration"
  };
}

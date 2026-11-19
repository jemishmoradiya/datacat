import { describe, expect, it } from "vitest";
import { PRESETS, SHORT } from "../src/lib/time";

describe("time presets", () => {
  it("every preset has a short label and a positive duration", () => {
    for (const p of PRESETS) {
      expect(SHORT[p.label]).toBeTruthy();
      expect(p.seconds).toBeGreaterThan(0);
    }
  });
  it("presets are sorted ascending", () => {
    const s = PRESETS.map((p) => p.seconds!);
    expect([...s].sort((a, b) => a - b)).toEqual(s);
  });
});

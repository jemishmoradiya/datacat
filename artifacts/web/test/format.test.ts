import { afterEach, describe, expect, it, vi } from "vitest";
import { colorFor, fmtAgo, fmtDuration, fmtNum, fmtPct, PALETTE, WARM } from "../src/lib/format";

describe("fmtNum", () => {
  it("shows a dash for missing values", () => {
    for (const v of [null, undefined, NaN]) expect(fmtNum(v)).toBe("—");
  });
  it("scales large numbers", () => {
    expect(fmtNum(1.5e12)).toBe("1.5T");
    expect(fmtNum(2e9)).toBe("2.0G");
    expect(fmtNum(3e6)).toBe("3.0M");
    expect(fmtNum(12_000)).toBe("12.0K");
    expect(fmtNum(-12_000)).toBe("-12.0K");
  });
  it("trims trailing zeros and handles small values", () => {
    expect(fmtNum(250)).toBe("250");
    expect(fmtNum(2.5)).toBe("2.5");
    expect(fmtNum(2)).toBe("2");
    expect(fmtNum(0)).toBe("0");
    expect(fmtNum(0.01234)).toBe("0.012");
  });
});

describe("fmtDuration (nanoseconds)", () => {
  it("picks the right unit", () => {
    expect(fmtDuration(null)).toBe("—");
    expect(fmtDuration(500)).toBe("500 ns");
    expect(fmtDuration(5_000)).toBe("5 µs");
    expect(fmtDuration(5e6)).toBe("5.0 ms");
    expect(fmtDuration(5e8)).toBe("500 ms");
    expect(fmtDuration(2.5e9)).toBe("2.50 s");
    expect(fmtDuration(9e10)).toBe("1.5 min");
  });
});

describe("fmtPct", () => {
  it("formats and guards", () => {
    expect(fmtPct(12.345)).toBe("12.3%");
    expect(fmtPct(12.345, 2)).toBe("12.35%");
    expect(fmtPct(undefined)).toBe("—");
  });
});

describe("fmtAgo", () => {
  afterEach(() => vi.useRealTimers());
  it("uses s, m, h and d buckets", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000_000_000_000);
    const ago = (s: number) => fmtAgo(Date.now() - s * 1000);
    expect(ago(5)).toBe("5s ago");
    expect(ago(120)).toBe("2m ago");
    expect(ago(7200)).toBe("2h ago");
    expect(ago(172_800)).toBe("2d ago");
  });
});

describe("colorFor", () => {
  it("wraps around the palette and selects by name", () => {
    expect(colorFor(PALETTE.length)).toBe(PALETTE[0]);
    expect(colorFor(1, "warm")).toBe(WARM[1]);
    expect(colorFor(0, "unknown")).toBe(PALETTE[0]);
  });
});

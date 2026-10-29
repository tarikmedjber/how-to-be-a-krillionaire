import { nextEmptyAfter, resolveFillTarget } from "./fillTarget.ts";

const ids = ["1", "2", "3"];

describe("resolveFillTarget", () => {
  it("prefers the box the host focused, even if it's filled", () => {
    expect(resolveFillTarget(ids, { 2: "May" }, "2")).toBe("2");
  });

  it("falls back to the first empty box", () => {
    expect(resolveFillTarget(ids, { 1: "May" }, null)).toBe("2");
    expect(resolveFillTarget(ids, { 1: "a", 2: "b", 3: "c" }, null)).toBeNull();
  });

  it("ignores a focused id that's no longer answering", () => {
    expect(resolveFillTarget(ids, {}, "9")).toBe("1");
  });
});

describe("nextEmptyAfter", () => {
  it("wraps round to earlier empty boxes", () => {
    expect(nextEmptyAfter(ids, { 2: "x", 3: "y" }, "3")).toBe("1");
    expect(nextEmptyAfter(ids, { 1: "x", 2: "y", 3: "z" }, "2")).toBeNull();
  });
});

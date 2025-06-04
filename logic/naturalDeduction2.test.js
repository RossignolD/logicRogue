import { NaturalDeduction, Line } from "./naturalDeduction2";

test("natural deduction can be created", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  expect(nd).toBeDefined();
});

test("natural deduction contains correct show line", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  expect(nd).toHaveProperty("showLine", "Q");
});

test("natural deduction contains correct show line", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  expect(nd).toHaveProperty("premises", ["P-Q", "P"]);
});

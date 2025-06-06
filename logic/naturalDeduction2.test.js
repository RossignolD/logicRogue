import { NaturalDeduction, Line } from "./naturalDeduction2";

test("natural deduction can be created", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  expect(nd).toBeDefined();
});

test("natural deduction contains correct show line", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  expect(nd).toHaveProperty("showLine", "Q");
});

test("natural deduction contains correct premises", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  expect(nd).toHaveProperty("premises", ["P-Q", "P"]);
});

test("premises can be loaded in as lines in a natural deduction", () => {
  const nd = new NaturalDeduction("Q", ["P-Q", "P"]);
  nd.addPremises();
  expect(nd.lines).toContainEqual({
    tree: { "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }] },
    justification: "Premise",
  });
});

test("can add an assumption for CD at start of deduction", () => {
  const nd = new NaturalDeduction("P-R", ["P-Q", "P-R"]);
  nd.addAssumption("CD");
  expect(nd.lines).toContainEqual({
    tree: { atomic: "P" },
    justification: "Asm. CD",
  });
});

test("can complete a natural deduction by DD", () => {
  const nd = new NaturalDeduction("Q", ["(~(P-Q))-(~R)", "R", "P"]);
  nd.addPremises();
  nd.addLine("DNI", "R");
  nd.addLine("MT", "(~(P-Q))-(~R)", "~~R");
  nd.addLine("DNE", "~~(P-Q)");
  nd.addLine("MP", "P-Q", "P");
  expect(nd.addLine("MP", "P-Q", "P")).toBe("Proof completed");
});

test("can complete a natural deduction by CD", () => {
  const nd = new NaturalDeduction("P-R", ["P-Q", "Q-R"]);
  nd.addAssumption("CD");
  nd.addPremises();
  nd.addLine("MP", "P", "P-Q");
  nd.addLine("MP", "Q", "Q-R");
  expect(nd.addLine("MP", "Q", "Q-R")).toBe("Proof completed");
});

test("can complete a natural deduction by ID", () => {
  const nd = new NaturalDeduction("~P", ["P-Q", "P-(~Q)"]);
  nd.addAssumption("ID");
  nd.addPremises();
  nd.addLine("DNE", "~~P");
  nd.addLine("MP", "P", "P-(~Q)");
  nd.addLine("MP", "P", "P-Q");
  expect(nd.addLine("MP", "P", "P-Q")).toBe("Proof completed");
});

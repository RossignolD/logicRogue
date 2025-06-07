import {
  parseSentence,
  splitOnMainConnective,
  getAntecedent,
  getConsequent,
  negateSentence,
  modusPonens,
  modusTollens,
  doubleNegationIntro,
  doubleNegationElim,
  treeToSentence,
} from "./parsingAndRules2";

test("correctly parses an atomic sentence", () => {
  const tree = parseSentence("P");
  expect(tree).toStrictEqual({ atomic: "P" });
});

test("correctly parses negation of an atomic sentence", () => {
  const tree = parseSentence("~P");
  expect(tree).toStrictEqual({ NOT: { atomic: "P" } });
});

test("correctly parses material conditional of two atomic sentences", () => {
  const tree = parseSentence("P-Q");
  expect(tree).toStrictEqual({ "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }] });
});

test("correctly returns the arguments of the main conditional", () => {
  const splitTree = splitOnMainConnective("P-Q");
  expect(splitTree).toStrictEqual([{ atomic: "P" }, { atomic: "Q" }]);
});

test("correctly returns the arguments of a more complex conditional", () => {
  const splitTree = splitOnMainConnective("(P-Q)-(~R)");
  expect(splitTree).toStrictEqual([
    { "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }] },
    { NOT: { atomic: "R" } },
  ]);
});

test("correctly returns the argumens of the negation as a main connective", () => {
  const unnegated = splitOnMainConnective("~P");
  expect(unnegated).toStrictEqual({ atomic: "P" });
});

test("correctly returns the antecedent of a material conditional", () => {
  const antecedent = getAntecedent("P-Q");
  expect(antecedent).toStrictEqual({ atomic: "P" });
});
test("returns a message when trying to get antecedent of a non-conditional", () => {
  const antecedent = getAntecedent("P");
  expect(antecedent).toBe(
    "this is not a conditional, so there is no antecedent"
  );
});
test("returns a message when trying to get antecedent of a negation", () => {
  const antecedent = getAntecedent("~P");
  expect(antecedent).toBe(
    "this is not a conditional, so there is no antecedent"
  );
});
test("correctly returns the consequent of a material conditional", () => {
  const consequent = getConsequent("P-Q");
  expect(consequent).toStrictEqual({ atomic: "Q" });
});

test("returns a message when trying to get consequent of a non-conditional", () => {
  const consequent = getConsequent("P");
  expect(consequent).toBe(
    "this is not a conditional, so there is no consequent"
  );
});

test("can negate a single atomic sentence", () => {
  const negated = negateSentence("P");
  expect(negated).toStrictEqual({
    NOT: { atomic: "P" },
  });
});

test("can negate a conditional sentence", () => {
  const negated = negateSentence("(P-Q)");
  expect(negated).toStrictEqual({
    NOT: { "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }] },
  });
});

test("can resolve an instance of MP for a simple condtional", () => {
  const conclusion = modusPonens("P-Q", "P");
  expect(conclusion).toStrictEqual({ atomic: "Q" });
});

test("can resolve MP for a more complex conditional", () => {
  const conclusion = modusPonens("(P-Q)-(~R)", "P-Q");
  expect(conclusion).toStrictEqual({ NOT: { atomic: "R" } });
});

test("can resolve MT for a simple conditional", () => {
  const conclusion = modusTollens("P-Q", "~Q");
  expect(conclusion).toStrictEqual({ NOT: { atomic: "P" } });
});

test("can resolve MT for a more complex conditional", () => {
  const conclusion = modusTollens("(P-Q)-(~R)", "~(~R)");
  expect(conclusion).toStrictEqual({
    NOT: { "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }] },
  });
});

test("double negation intro works on atomic sentences", () => {
  const conclusion = doubleNegationIntro("P");
  expect(conclusion).toStrictEqual({ NOT: { NOT: { atomic: "P" } } });
});

test("double negation elimination works on atomic sentences", () => {
  const conclusion = doubleNegationElim("~(~(P))");
  expect(conclusion).toStrictEqual({ atomic: "P" });
});

test("can turn an atomic tree into a sentence", () => {
  const sentence = treeToSentence({ atomic: "P" });
  expect(sentence).toBe("P");
});

test("can turn a negation of an atomic tree into a sentence", () => {
  const sentence = treeToSentence({ NOT: { atomic: "P" } });
  expect(sentence).toBe("(~P)");
});

test("can turn a material conditional tree of atomic sentences into correct sentence", () => {
  const sentence = treeToSentence({
    "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }],
  });
  expect(sentence).toBe("(P-Q)");
});

test("can turn a more complex tree into a sentence", () => {
  const sentence = treeToSentence({
    "ONLY IF": [{ atomic: "P" }, { NOT: { atomic: "Q" } }],
  });
  expect(sentence).toBe("(P-(~Q))");
});

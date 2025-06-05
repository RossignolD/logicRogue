import FormulaParser from "formula-parser";

const variableKey = "atomic";
const unaries = [{ symbol: "~", key: "NOT", precedence: 0 }];
const binaries = [
  { symbol: "-", key: "ONLY IF", precedence: 1, associativity: "right" },
];

const unmodifiedParser = new FormulaParser(variableKey, unaries, binaries);

function parseSentence(sentence) {
  const tree = {};
  try {
    if (sentence.length == 1) {
      tree["atomic"] = sentence;
      return tree;
    } else {
      return unmodifiedParser.parse(sentence);
    }
  } catch (error) {
    console.log(error);
  }
}

function splitOnMainConnective(sentence) {
  const tree = parseSentence(sentence);
  if ("ONLY IF" in tree) {
    return tree["ONLY IF"];
  } else if ("NOT" in tree) {
    return tree["NOT"];
  } else {
    return tree;
  }
}

function getAntecedent(sentence) {
  const tree = parseSentence(sentence);
  if ("ONLY IF" in tree) {
    return splitOnMainConnective(sentence)[0];
  } else return "this is not a conditional, so there is no antecedent";
}

function getConsequent(sentence) {
  const tree = parseSentence(sentence);
  if ("ONLY IF" in tree) {
    return splitOnMainConnective(sentence)[1];
  } else return "this is not a conditional, so there is no consequent";
}
function negateSentence(sentence) {
  const tree = parseSentence(sentence);
  return negateTree(tree);
}
function negateTree(tree) {
  const newTree = {};
  newTree["NOT"] = tree;
  return newTree;
}

function modusPonens(sentence1, sentence2) {
  const tree1 = parseSentence(sentence1);
  const tree2 = parseSentence(sentence2);
  //   console.log(tree1, tree2);
  if ("ONLY IF" in tree1) {
    const antecedent = JSON.stringify(getAntecedent(sentence1));
    const consequent = getConsequent(sentence1);
    if (antecedent == JSON.stringify(tree2)) {
      return consequent;
    } else {
      return "Antecedent is not correct";
    }
  } else if ("ONLY IF" in tree2) {
    // console.log(antecedent, consequent);
    const antecedent = JSON.stringify(getAntecedent(sentence2));
    const consequent = getConsequent(sentence2);
    if (antecedent == JSON.stringify(tree1)) {
      return consequent;
    } else {
      return "Hello, Antecedent is not correct";
    }
  } else {
    return "Modus Ponens is not applicable here";
  }
}

function modusTollens(sentence1, sentence2) {
  const tree1 = parseSentence(sentence1);
  const tree2 = parseSentence(sentence2);
  if ("ONLY IF" in tree1) {
    const antecedent = getAntecedent(sentence1);
    const consequent = getConsequent(sentence1);
    const negatedAntecedent = negateTree(antecedent);
    const negatedConsequent = negateTree(consequent);
    if (JSON.stringify(negatedConsequent) == JSON.stringify(tree2)) {
      return negatedAntecedent;
    } else {
      return "Negated Consequent is not correct";
    }
  } else if ("ONLY IF" in tree1) {
    const antecedent = getAntecedent(sentence2);
    const consequent = getConsequent(sentence2);
    const negatedAntecedent = negateTree(antecedent);
    const negatedConsequent = negateTree(consequent);
    if (JSON.stringify(negatedConsequent) == JSON.stringify(tree1)) {
      return negatedAntecedent;
    } else {
      return "Negated Consequent is not correct";
    }
  } else {
    return "Modus Tollens is not applicable here";
  }
}

function doubleNegationIntro(sentence) {
  const tree = parseSentence(sentence);
  const negatedTree = negateTree(tree);
  return negateTree(negatedTree);
}

function doubleNegationElim(sentence) {
  const tree = parseSentence(sentence);
  if ("NOT" in tree && "NOT" in tree["NOT"]) {
    return tree["NOT"]["NOT"];
  } else {
    return "There is no double negation that can be eliminated";
  }
}

// function main() {
//   //   console.log(splitOnMainConnective("P-Q"));
//   console.log(modusPonens("P-Q", "P"));
// }
// main();

export {
  parseSentence,
  splitOnMainConnective,
  getAntecedent,
  getConsequent,
  negateSentence,
  modusPonens,
  modusTollens,
  doubleNegationIntro,
  doubleNegationElim,
};

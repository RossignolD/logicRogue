import FormulaParser from "formula-parser";

const variableKey = "atomic";
const unaries = [{ symbol: "~", key: "NOT", precedence: 0 }];
const binaries = [
  { symbol: "-", key: "ONLY IF", precedence: 1, associativity: "right" },
];
const myParser = new FormulaParser(variableKey, unaries, binaries);

function parseSentence(sentence) {
  const parse = {};
  try {
    if (sentence.length == 1) {
      parse["atomic"] = sentence;
      return parse;
    } else {
      return myParser.parse(sentence);
    }
  } catch (error) {
    console.log(error);
  }
}

function splitOnMainConnective(sentence) {
  const parsed = parseSentence(sentence);
  if ("ONLY IF" in parsed) {
    return parsed["ONLY IF"];
  } else return parsed["NOT"];
}

function modusPonens(sentence1, sentence2) {
  const parsed1 = parseSentence(sentence1);
  const parsed2 = parseSentence(sentence2);
  const split1 = splitOnMainConnective(sentence1);
  const split2 = splitOnMainConnective(sentence2);
  if ("ONLY IF" in parsed1) {
    const antecedent = JSON.stringify(split1[0]);
    const consequent = split1[1];
    if (antecedent == JSON.stringify(parsed2)) {
      return consequent;
    } else {
      return null;
    }
  } else if ("ONLY IF" in parsed2) {
    const antecedent = JSON.stringify(split2[0]);
    const consequent = split2[1];
    if (antecedent == JSON.stringify(parsed1)) {
      return consequent;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function modusTollens(sentence1, sentence2) {
  const parsed1 = parseSentence(sentence1);
  const parsed2 = parseSentence(sentence2);
  const split1 = splitOnMainConnective(sentence1);
  const split2 = splitOnMainConnective(sentence2);
  if ("ONLY IF" in parsed1) {
    const antecedent = split1[0];
    const consequent = split1[1];
    const negatedConsequent = {};
    negatedConsequent["NOT"] = consequent;
    const negatedAntecedent = {};
    negatedAntecedent["NOT"] = antecedent;
    if (JSON.stringify(negatedConsequent) == JSON.stringify(parsed2)) {
      return negatedAntecedent;
    } else {
      return null;
    }
  } else if ("ONLY IF" in parsed2) {
    const antecedent = split2[0];
    const consequent = split2[1];
    const negatedConsequent = {};
    negatedConsequent["NOT"] = consequent;
    const negatedAntecedent = {};
    negatedAntecedent["NOT"] = antecedent;
    if (JSON.stringify(negatedConsequent) == JSON.stringify(parsed1)) {
      return negatedAntecedent;
    } else {
      return null;
    }
  } else {
    return null;
  }
}

function doubleNegationElim(sentence) {
  const parsed = parseSentence(sentence);
  if ("NOT" in parsed && "NOT" in parsed["NOT"]) {
    return parsed["NOT"]["NOT"];
  } else {
    return null;
  }
}

function doubleNegationIntro(sentence) {
  const parsed = parseSentence(sentence);
  const negatedSentence = {};
  const doubleNegatedSentence = {};
  negatedSentence["NOT"] = parsed;
  doubleNegatedSentence["NOT"] = negatedSentence;
  return doubleNegatedSentence;
}

export {
  parseSentence,
  splitOnMainConnective,
  modusPonens,
  modusTollens,
  doubleNegationElim,
  doubleNegationIntro,
};

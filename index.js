const formulaParser = require("formula-parser");

const variableKey = "atomic";
const unaries = [{ symbol: "~", key: "NOT", precedence: 0 }];
const binaries = [
  { symbol: "-", key: "ONLY IF", precedence: 1, associativity: "right" },
];
const myParser = new formulaParser(variableKey, unaries, binaries);

function parseSentence(sentence) {
  const parse = {};
  if (sentence.length == 1) {
    parse["atomic"] = sentence;
    return parse;
  } else {
    return myParser.parse(sentence);
  }
}

function splitOnMainConnective(sentence) {
  const parsed = myParser.parse(sentence);
  if ("ONLY IF" in parsed) {
    return parsed["ONLY IF"];
  } else return parsed["NOT"];
}

function modusPonens(sentence1, sentence2) {
  const parsed1 = myParser.parse(sentence1);
  const parsed2 = myParser.parse(sentence2);
  const split1 = splitOnMainConnective(sentence1);
  const split2 = splitOnMainConnective(sentence2);
  if ("ONLY IF" in parsed1) {
    const antecedent = JSON.stringify(split1[0]);
    const consequent = split1[1];
    if (antecedent == JSON.stringify(parsed2)) {
      return consequent;
    }
  } else if ("ONLY IF" in parsed2) {
    const antecedent = JSON.stringify(split2[0]);
    const consequent = split2[1];
    if (antecedent == JSON.stringify(parsed1)) {
      return consequent;
    }
  } else {
    return "Cannot apply Modus Ponens to these sentences";
  }
}

console.log(modusPonens("(A-B)-(~(D-E))", "A-B"));

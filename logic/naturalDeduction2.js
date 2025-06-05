import {
  parseSentence,
  splitOnMainConnective,
  modusPonens,
  modusTollens,
  doubleNegationIntro,
  doubleNegationElim,
} from "./parsingAndRules2.js";

export class NaturalDeduction {
  constructor(showLine, premises = []) {
    this.showLine = showLine;
    this.premises = premises;
    this.lines = [];
    for (let premise of premises) {
      this.lines.push(new Line(parseSentence(premise), "premise"));
    }
  }

  isExistingLine(sentence) {
    if (sentence !== null) {
      const myTree = parseSentence(sentence);
      return this.lines.some(
        (line) => JSON.stringify(line.tree) === JSON.stringify(myTree)
      );
    }
  }

  applyInferenceRule(rule, sentence1, sentence2 = null) {
    if (this.isExistingLine(sentence1) && (rule === "DNI" || rule === "DNE")) {
      if (rule === "DNI") {
        return doubleNegationIntro(sentence1);
      } else if (rule === "DNE") {
        return doubleNegationElim(sentence1);
      }
    } else if (
      this.isExistingLine(sentence1) &&
      this.isExistingLine(sentence2)
    ) {
      if (rule === "MP") {
        return modusPonens(sentence1, sentence2);
      }
      if (rule === "MT") {
        return modusTollens(sentence1, sentence2);
      }
    }
  }
  addLine(justification, sentence1, sentence2 = null) {
    const conclusion = this.applyInferenceRule(
      justification,
      sentence1,
      sentence2
    );
    if (conclusion) {
      const newLine = new Line(conclusion, justification);
      this.lines.push(newLine);
      this.isSolved(conclusion);
      if (this.isSolved(conclusion)) {
        return "Proof completed";
      } else {
        return "Proof not yet complete";
      }
    } else return "Cannot add the new line";
  }
  isSolved(tree) {
    return JSON.stringify(tree) == JSON.stringify(parseSentence(this.showLine));
  }
}

export class Line {
  constructor(tree, justification) {
    this.tree = tree;
    this.justification = justification;
  }
}

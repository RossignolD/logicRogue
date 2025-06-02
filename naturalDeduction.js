import {
  parseSentence,
  splitOnMainConnective,
  modusPonens,
  modusTollens,
  doubleNegationElim,
  doubleNegationIntro,
} from "./parsingAndRules.js";

export class NaturalDeduction {
  constructor(showLine, premises = []) {
    this.showLine = showLine;
    this.premises = premises;
    this.lines = [
      this.premises.map((premise) => new Line(premise, "premise", [])),
    ];
  }
  addAssumption(type) {
    if (type == "CD") {
      let assumption = this.getAntecedent();
      this.lines.push(new Line(assumption, "Asm. CD"));
    } else if (type == "ID") {
      let assumption = {};
      assumption["NOT"] = this.showLine;
      this.lines.push(new Line(assumption, "Asm. ID"));
    }
  }
  getAntecedent() {
    const parsed = parseSentence(this.showLine);
    if ("ONLY IF" in parsed) {
      return splitOnMainConnective(parsed)[0];
    } else {
      return null;
    }
  }

  getConsequent() {
    const parsed = parseSentence(this.showLine);
    if ("ONLY IF" in parsed) {
      return splitOnMainConnective(parsed)[1];
    } else {
      return null;
    }
  }

  applyInferenceRule(rule, sentence1, sentence2 = null) {
    if (rule === "MP") {
      return modusPonens(sentence1, sentence2);
    } else if (rule === "MT") {
      return modusTollens(sentence1, sentence2);
    } else if (rule === "DNE") {
      return doubleNegationElim(sentence1);
    } else if (rule === "DNI") {
      return doubleNegationIntro(sentence2);
    } else {
      throw new Error("Unknown inference rule: " + rule);
    }
  }
  addLine(sentence1, sentence2, justification) {
    const conclusion = this.applyInferenceRule(
      justification,
      sentence1,
      sentence2
    );
    if (conclusion !== null) {
      const newLine = new Line(conclusion, justification);
      this.lines.push(newLine);
      this.isSolved(conclusion);
    } else {
      return null;
    }
  }

  checkForContradiction(sentence) {
    const parsed = parseSentence(sentence);
    const negatedSentence = {};
    negatedSentence["NOT"] = parsed;
    for (let line of this.lines) {
      if (JSON.stringify(line) == JSON.stringify(negatedSentence)) {
        return true;
      } else return false;
    }
  }
  isSolved(sentence) {
    if (
      JSON.stringify(sentence) == JSON.stringify(parseSentence(this.showLine))
    ) {
      console.log("Solved by DD");
      return true;
    } else if (parsed == JSON.stringify(this.getConsequent())) {
      console.log("Solved by CD");
      return true;
    } else if (this.checkForContradiction(sentence) == true) {
      console.log("Solved by ID");
      return true;
    } else {
      console.log("the sentence is not solved");
      return false;
    }
  }
}
export class Line {
  constructor(sentence, justification) {
    this.sentence = sentence;
    this.justification = justification;
  }
}

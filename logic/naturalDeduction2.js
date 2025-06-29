import {
  parseSentence,
  treeToSentence,
  modusPonens,
  modusTollens,
  doubleNegationIntro,
  doubleNegationElim,
  negateSentence,
  negateTree,
  getConsequent,
  getAntecedent,
} from "./parsingAndRules2.js";

export class NaturalDeduction {
  constructor(showLine, premises = []) {
    this.showLine = showLine;
    this.premises = premises;
    this.lines = [];
  }

  addAssumption(type) {
    if (type == "CD" && this.lines.length == 0) {
      let assumption = getAntecedent(this.showLine);
      this.lines.push(new Line(assumption, "Asm. CD"));
      return "Succesfully added assumption for CD";
    } else if (type == "ID" && this.lines.length == 0) {
      let assumption = negateSentence(this.showLine);
      this.lines.push(new Line(assumption, "Asm. ID"));
      return "Succesfully added assumption for ID";
    } else return "Cannot add assumption";
  }

  addPremises() {
    if (this.premises.length !== 0) {
      for (let premise of this.premises) {
        let premiseTree = parseSentence(premise);
        this.lines.push(new Line(premiseTree, "Premise"));
      }
      return "Premises added";
    } else {
      return "No premises to be added";
    }
  }

  isExistingLine(sentence) {
    console.log(sentence);
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
        console.log(modusTollens(sentence1, sentence2));
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
      if (this.isSolved(conclusion)) {
        return "Proof completed";
      } else {
        return "Proof not yet complete";
      }
    } else return "Cannot add the new line";
  }
  checkForCDCompletion(tree) {
    if (JSON.stringify(tree) == JSON.stringify(getConsequent(this.showLine))) {
      console.log("Solved by CD");
      return true;
    } else {
      return false;
    }
  }
  // checkForIDCompletion(myTree) {
  //   const negatedTree = negateTree(myTree);
  //   for (let line of this.lines) {
  //     if (JSON.stringify(line["tree"]) == JSON.stringify(negatedTree)) {
  //       console.log("Solved by ID");
  //       return true;
  //     } else if (JSON.stringify(negateTree(line["tree"])) == myTree) {
  //       console.log("Solved by ID");
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   }
  // }

  checkForIDCompletion(myTree) {
    const negatedTree = negateTree(myTree);
    for (let line of this.lines) {
      if (JSON.stringify(negatedTree) == JSON.stringify(line.tree)) {
        return true;
      } else if (
        JSON.stringify(myTree) == JSON.stringify(negateTree(line.tree))
      ) {
        return true;
      } else {
        return false;
      }
    }
  }

  isSolved(tree) {
    if (JSON.stringify(tree) == JSON.stringify(parseSentence(this.showLine))) {
      return true;
    } else if (this.checkForCDCompletion(tree)) {
      return true;
    } else if (this.checkForIDCompletion(tree)) {
      return true;
    } else return false;
  }
  prettyPrintLines() {
    const prettyPrintedLines = [];
    for (let line of this.lines) {
      prettyPrintedLines.push(treeToSentence(line.tree));
    }
    return prettyPrintedLines;
  }
}

export class Line {
  constructor(tree, justification) {
    this.tree = tree;
    this.justification = justification;
  }
}

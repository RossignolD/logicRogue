import React, { useState, useEffect } from "react";
import styles from "./Encounter.module.css";
import { NaturalDeduction } from "../../logic/naturalDeduction2";
import { parseSentence, treeToSentence } from "../../logic/parsingAndRules2";
import encounters from "../../encounters.json";

// const [newItemName, setNewItemName] = useState("");
// const [rulesText, setRulesText] = useState([]);

console.log(encounters);

function Encounter({ encounterName }) {
  const showLine = encounters[encounterName]["showLine"];
  const nd = new NaturalDeduction(
    showLine,
    encounters[encounterName]["premises"]
  );
  const [inventoryItems, updateInventory] = useState(nd.prettyPrintLines());
  const [pendingRule, setPendingRule] = useState(null);
  const [selectedIndices, setSelectedIndices] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      iframe.contentWindow.postMessage(
        "Hello from Encounter",
        "http://localhost:3001/"
      );
    }, 200);
  });

  const handleCodexClick = () => {
    console.log("you have opened the codex");
  };

  const handleClick = (rule, event) => {
    if (rule == "Add Premises") {
      nd.addPremises();
      updateInventory(nd.prettyPrintLines());
      console.log("Premises added");
    } else if (["DNE", "DNI", "MP", "MT"]) {
      setPendingRule(rule);
      setSelectedIndices([]);
      console.log("Pending rule set to:", rule);
    }
  };

  const handleInventoryClick = (idx) => {
    if (!pendingRule) return;
    const newSelected = [...selectedIndices, idx];
    setSelectedIndices(newSelected);

    if (newSelected.length === 2) {
      // Try to apply the rule to the selected items
      // You need to implement this logic in your NaturalDeduction class
      const [i1, i2] = newSelected;
      try {
        nd.applyInferenceRule(pendingRule, i1, i2); // You must implement this method
        updateInventory(nd.prettyPrintLines());
        alert(`${pendingRule} applied to items ${newSelected.join(", ")}`);
      } catch (e) {
        alert(`Failed to apply ${pendingRule}: ${e.message}`);
      }
      setPendingRule(null);
      setSelectedIndices([]);
    }
  };

  return (
    <div className={styles.Encounter}>
      <div>This is codex icon</div>
      <div className={styles.showLine}>
        <h1>
          {treeToSentence(parseSentence(encounters[encounterName].showLine))}
        </h1>
      </div>
      <div className={styles.inventory}>
        <h2>Encounter Inventory</h2>
        <div>
          {inventoryItems.map((item, idx) => {
            return (
              <button onClick={() => handleInventoryClick(idx)}>{item}</button>
            );
          })}
        </div>
      </div>
      <div className={styles.rules}>
        <h2>Rules</h2>
        {encounters[encounterName].unlockedRules.map((rule) => {
          return (
            <button onClick={(event) => handleClick(rule, event)}>
              {rule}
            </button>
          );
        })}
      </div>
    </div>
  );
}
export default Encounter;

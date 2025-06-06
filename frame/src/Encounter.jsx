import React, { useState, useEffect } from "react";
import styles from "./Encounter.module.css";
import { NaturalDeduction } from "../../logic/naturalDeduction2";
import encounters from "../../encounters.json";

const [inventoryItems, setInventoryItems] = useState([]);
const [newItemName, setNewItemName] = useState("");
const [rulesText, setRulesText] = useState([]);

console.log(encounters);

function Encounter({ encounterName }) {
  useEffect(() => {
    setTimeout(() => {
      iframe.contentWindow.postMessage(
        "Hello from react",
        "http://localhost:3001/"
      );
    }, 200);
  });

  const parseTree = { "ONLY IF": [{ atomic: "P" }, { atomic: "Q" }] };

  const handleAddTree = () => {
    setInventoryItems((prevItems) => [...prevItems, parseTree]);
  };
  const handleCodexClick = () => {
    console.log("you have opened the codex");
  };

  return (
    <div className={styles.Encounter}>
      <div>This is codex icon</div>
      <div className={styles.showLine}>
        <h1>{encounters[0].showLine}</h1>
      </div>
      <div className={styles.inventory}>
        <h2>Encounter Inventory</h2>
      </div>
      <div className={styles.rules}>Rules unlocked so far here</div>
    </div>
  );
}

export default Encounter;

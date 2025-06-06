import React from "react";
import styles from "./Encounter.module.css";
import { NaturalDeduction } from "../../logic/naturalDeduction2";
import encounters from "../../encounters.json";

console.log(encounters);

function Encounter({ encounterName }) {
  return (
    <div className={styles.Encounter}>
      <div className={styles.showLine}>
        <h1>{encounters[0].showLine}</h1>
      </div>
      <div className={styles.inventory}>Inventory component here</div>
      <div className={styles.rules}>Rules unlocked so far here</div>
    </div>
  );
}

export default Encounter;

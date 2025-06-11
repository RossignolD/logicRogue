import React, { useState, useEffect, useRef } from "react";
import { ErrorBoundary } from "react-error-boundary";
import styles from "./App.module.css";
import "./App.module.css";
import Encounter from "./Encounter.jsx";
import useFetch from "./useFetchFromDataBase.jsx";
import Saving from "./Saving.jsx";

function App() {
  const [isBattling, setIsBattling] = useState(false);
  const iframeRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveData, setSaveData] = useState({ posX: 0, posY: 0, scene: "" });

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.style.height = `${window.innerHeight - 160}px`;
      iframe.style.width = `${window.innerWidth - 160}px`;
    }
    window.addEventListener("resize", () => {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        iframe.style.height = `${window.innerHeight - 160}px`;
        iframe.style.width = `${window.innerWidth - 160}px`;
      }
    });
    window.addEventListener("message", (event) => {
      // console.log("message received from kaplay:", event.data);
      if (event.data === "battle initiated") {
        setIsBattling(true);
      }
      if (event.data.message === "Save game") {
        setIsSaving(true);
        console.log("Game saved");
        console.log("event data:", event.data);
        setSaveData({
          posX: event.data.position.transferGlobalX,
          posY: event.data.position.transferGlobalY,
          scene: event.data.thisScene,
        });
        // console.log("Transferrable data:", event.data.position);
        // console.log("Current scene:", event.data.thisScene);
      }
    });
    // setTimeout(() => {
    //   iframe.contentWindow.postMessage(
    //     {
    //       message: "Load game",
    //       position: { x: 64, y: 64 }, //load these from database
    //       scene: "town", //load these from database
    //     },
    //     "http://localhost:3001/"
    //   );
    // }, 1000);
    setTimeout(() => {
      iframe.contentWindow.postMessage(
        "Hello from react",
        "http://localhost:3001/"
      );
    }, 200);
    let playerId = "a422ea59-9549-4ef8-bb13-6cda3538a7f3";
    const fetchData = async () => {
      const response = await fetch(`/game/save/${playerId}`);
      setTimeout(async () => {
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched save data:", data);
          console.log("Player position:", data.player.currentLocation);
          console.log("Current scene:", data.player.currentScene);
          iframe.contentWindow.postMessage(
            {
              message: "Load game",
              position: data.player.currentLocation,
              scene: data.player.currentScene,
            },
            "http://localhost:3001/"
          );

          // You can set this data to state if needed
        } else {
          console.error("Failed to fetch save data");
        }
      }, 1000);
    };

    fetchData();
  }, []);
  const handleLogicError = (x) => {
    iframeRef.current.contentWindow.postMessage(
      "Proof failed! BOO!",
      "http://localhost:3001/"
    );
    setIsBattling(false);
  };

  return (
    <div className={styles.appGrid}>
      {
        isSaving && (
          <div className={styles.savingContainer}>
            <Saving {...saveData} setIsSaving={setIsSaving}></Saving>
          </div>
        )
        //need data from iframe to save
        //set is saving to false when done
        //inside saving component that's where I use fetch hook
      }
      <div className={styles.title}>
        <h1>Logic Rogue</h1>
      </div>
      <div className={styles.gameContainer}>
        <iframe
          tag="iframe"
          src="http://localhost:3001"
          width="100%"
          height="100%"
          allowFullScreen={true}
          ref={iframeRef}
        ></iframe>
      </div>
      {isBattling && (
        <div className={styles.encounterContainer}>
          <ErrorBoundary
            onError={handleLogicError}
            fallback={<div>Error occurred</div>}
          >
            <Encounter
              encounterName="Encounter 1.3"
              iframeRef={iframeRef}
              isBatting={isBattling}
              setIsBattling={setIsBattling}
            ></Encounter>
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
}

export default App;

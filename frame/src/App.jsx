import React, { useState, useEffect, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Encounter from "./Encounter.jsx";
import useFetch from "./useFetchFromDataBase.jsx";

function App() {
  const [isBattling, setIsBattling] = useState(true);
  const iframeRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  let posX, posY, scene;
  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.style.height = `${window.innerHeight}px`;
      iframe.style.width = `${window.innerWidth}px`;
    }
    window.addEventListener("resize", () => {
      const iframe = document.querySelector("iframe");
      if (iframe) {
        iframe.style.height = `${window.innerHeight}px`;
        iframe.style.width = `${window.innerWidth}px`;
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
        posX = event.data.position.X;
        posY = event.data.position.Y;
        scene = event.data.thisScene;
        // console.log("Transferrable data:", event.data.position);
        // console.log("Current scene:", event.data.thisScene);
      }
    });
    setTimeout(() => {
      iframe.contentWindow.postMessage(
        {
          message: "Load game",
          position: { X: 64, Y: 64 }, //load these from database
          scene: "town", //load these from database
        },
        "http://localhost:3001/"
      );
    }, 1000);
    setTimeout(() => {
      iframe.contentWindow.postMessage(
        "Hello from react",
        "http://localhost:3001/"
      );
    }, 200);
  }, []);
  return (
    <div>
      {
        isSaving && (
          <Saving
            posX={posX}
            posY={posY}
            scene={scene}
            setIsSaving={setIsSaving}
          ></Saving>
        )
        //need data from iframe to save
        //set is saving to false when done
        //inside saving component that's where I use fetch hook
      }
      <iframe
        tag="iframe"
        src="http://localhost:3001"
        width="100%"
        height="100%"
        allowFullScreen={true}
        ref={iframeRef}
      ></iframe>
      {isBattling && (
        <Encounter
          encounterName="Encounter 1.3"
          iframeRef={iframeRef}
        ></Encounter>
      )}
    </div>
  );
}

export default App;

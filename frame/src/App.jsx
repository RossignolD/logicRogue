import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [isBattling, setIsBattling] = useState(false);

  useEffect(() => {
    const iframe = document.querySelector("iframe");
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
      console.log("message received from kaplay:", event.data);
      if (event.data === "battle initiated") {
        setIsBattling(true);
      }
    });
    setTimeout(() => {
      iframe.contentWindow.postMessage(
        "Hello from react",
        "http://localhost:3001/"
      );
    }, 200);
  }, []);
  return (
    // <div>
    //   <button
    //     onClick={() => {
    //       const iframe = document.querySelector("iframe");
    //       if (window.parent) {
    //         window.parent.postMessage(
    //           "Hello from parent",
    //           "http://localhost:5173"
    //         );
    //       }
    //     }}
    //   >
    //     Send Message to Iframe
    //   </button>
    // </div>
    <div>
      <h1>React App with Iframe</h1>
      {isBattling && <p>Battle is ongoing...</p>}
      <iframe
        tag="iframe"
        src="http://localhost:3001"
        width="100%"
        height="100%"
        allowFullScreen={true}
      ></iframe>
    </div>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
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
  }, []);
  return (
    <div>
      <iframe
        tag="iframe"
        src="http://localhost:3001"
        width="100%"
        height="100%"
        allowFullScreen="true"
      ></iframe>
    </div>
  );
}

export default App;

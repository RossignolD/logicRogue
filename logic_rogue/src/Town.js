import React, { useEffect } from "react";
import "./Town.css";
import { useAtom } from "jotai";
import { playerPositionAtom } from "./atoms/playerAtoms.js";

export default function Town() {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // later:

  const tileSize = 64;
  const stepSize = 32;

  const map = [
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 1, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  const [position, setPosition] = useAtom(playerPositionAtom);

  useEffect(() => {
    const handleKeyDown = (e) => {
      setPosition((pos) => {
        let { x, y } = pos;
        x = Math.max(0, Math.min(x, screenWidth - tileSize));
        y = Math.max(0, Math.min(y, screenHeight - tileSize));
        const step = stepSize;
        let nextX = x;
        let nextY = y;

        switch (e.key) {
          case "ArrowUp":
          case "w":
            nextY -= step;
            break;
          case "ArrowDown":
          case "s":
            nextY += step;
            break;
          case "ArrowLeft":
          case "a":
            nextX -= step;
            break;
          case "ArrowRight":
          case "d":
            nextX += step;
            break;
          default:
            break;
        }

        const col = Math.floor(nextX / tileSize);
        const row = Math.floor(nextY / tileSize);

        // Check bounds and collision
        const inBounds =
          row >= 0 && row < map.length && col >= 0 && col < map[0].length;

        if (inBounds && map[row][col] === 0) {
          return { x: nextX, y: nextY };
        }

        return pos; // blocked by wall
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setPosition]);

  return (
    <div className="town">
      <div
        className="player"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      />
      <div className="map">
        {map.map((row, rowIndex) =>
          row.map((tile, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={tile === 1 ? "tile wall" : "tile ground"}
              style={{
                top: rowIndex * tileSize,
                left: colIndex * tileSize,
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

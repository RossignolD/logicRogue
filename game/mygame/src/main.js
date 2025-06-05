import kaplay from "kaplay";
import "kaplay/global";

const moveSpeed = 200;

const map = ["110010", "010001", "222010"];
const k = kaplay({
  background: "#D3D3D3",
  scale: 1,
  canvas: document.getElementById("canvas"),

  buttons: {
    up: {
      keyboard: ["up", "w"],
    },
    down: {
      keyboard: ["down", "s"],
    },
    left: {
      keyboard: ["left", "a"],
    },
    right: {
      keyboard: ["right", "d"],
    },
  },
});

loadRoot("./");

scene("town", () => {
  const TILE_WIDTH = 128;
  const TILE_HEIGHT = 128;

  loadSprite("cobble", "sprites/cobble_tile.png");
  loadSprite("mossy cobble", "sprites/mossy_tile_alpha.png");

  const level = addLevel(map, {
    tileWidth: TILE_WIDTH,
    tileHeight: TILE_HEIGHT,
    tiles: {
      1: () => [sprite("cobble"), tile({ isObstacle: false })],
      0: () => [sprite("mossy cobble"), tile({ isObstacle: false })],
      2: () => [
        rect(TILE_WIDTH, TILE_HEIGHT),
        color(255, 0, 0),
        tile({ isObstacle: true, edges: ["left", "right", "top", "bottom"] }),
        "wall",
        area(),
        body({ isStatic: true }),
      ],
    },
  });

  //loads player sprite
  loadSprite("player", "sprites/player.png");
  //creates player
  const player = add([
    sprite("player"),
    pos(64, 64),
    anchor("center"),
    area({ scale: 0.75 }),
    body(),
    "player",
  ]);

  // Set camera position to follow the player
  const playerObject = get("player")[0];
  let lastX = player.pos.x;

  player.onUpdate(() => {
    setCamPos(playerObject.pos);
    if (player.pos.x < lastX) {
      player.flipX = false; // Flip horizontally
    } else if (player.pos.x > lastX) {
      player.flipX = true; // Unflip horizontally
    }
    lastX = player.pos.x;
  });

  onButtonDown("up", () => {
    player.move(0, -moveSpeed);
  });
  onButtonDown("down", () => {
    player.move(0, moveSpeed);
  });
  onButtonDown("left", () => {
    player.move(-moveSpeed, 0);
  });
  onButtonDown("right", () => {
    player.move(moveSpeed, 0);
  });
});

onClick(() => addKaboom(mousePos()));
go("town");

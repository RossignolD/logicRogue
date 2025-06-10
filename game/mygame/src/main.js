import kaplay from "kaplay";
import "kaplay/global";

const moveSpeed = 200;

const map = ["110010", "010001", "222010", "010001", "110010", "000000"];
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
setLayers(["bg", "obj", "ui"], "bg");
//loads player sprite
loadSprite("player", "sprites/player.png");
//creates player
function createPlayer(x = 64, y = 64) {
  return add([
    sprite("player"),
    pos(x, y),
    anchor("center"),
    area({ scale: 0.75 }),
    body(),
    "player",
    layer("obj"),
  ]);
}

let globalX = 64;
let globalY = 64;
window.addEventListener("message", (event) => {
  if (event.data.message === "Load game") {
    console.log("Message received from parent:", event.data);
    let sceneToBeLoaded = event.data.scene;
    globalX = event.data.position.X;
    globalY = event.data.position.Y;
    go(sceneToBeLoaded);
  }
});
scene("town", () => {
  window.parent.postMessage("Hello from iframe", "http://localhost:5173");
  const TILE_WIDTH = 128;
  const TILE_HEIGHT = 128;
  const player = createPlayer(globalX, globalY);

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

  // Set camera position to follow the player
  const playerObject = get("player")[0];

  let lastX = 0;
  player.onUpdate(() => {
    if (!isPaused) {
      globalX = player.pos.x;
      globalY = player.pos.y;
      setCamPos(playerObject.pos);
      if (player.pos.x < lastX) {
        player.flipX = false; // Flip horizontally
      } else if (player.pos.x > lastX) {
        player.flipX = true; // Unflip horizontally
      }
      lastX = player.pos.x;
    }
  });

  onButtonDown("up", () => {
    if (!isPaused) player.move(0, -moveSpeed);
  });
  onButtonDown("down", () => {
    if (!isPaused) player.move(0, moveSpeed);
  });
  onButtonDown("left", () => {
    if (!isPaused) player.move(-moveSpeed, 0);
  });
  onButtonDown("right", () => {
    if (!isPaused) player.move(moveSpeed, 0);
  });

  loadSprite("wizard", "sprites/wizard.png"); //change this to assets path
  const wizard = add([
    sprite("wizard"),
    pos(500, 500),
    anchor("center"),
    area(),
    body({ isStatic: true }),
    "wizard",
  ]);

  onCollide("player", "wizard", () => {
    window.parent.postMessage("Collided with wizard", "http://localhost:5173");
    go("wizard_dialogue");
  });

  function addPauseButton(labelText, yOffset, onClickAction) {
    const BUTTON_WIDTH = 260;
    const BUTTON_HEIGHT = 40;

    const button = pauseMenu.add([
      rect(BUTTON_WIDTH, BUTTON_HEIGHT, { radius: 8 }),
      pos(0, yOffset), // position relative to center of pauseMenu
      anchor("center"),
      color(200, 200, 255),
      area(),
      z(1001),
      "pauseButton",
    ]);

    const textLabel = pauseMenu.add([
      text(labelText, { size: 20 }),
      pos(0, yOffset),
      anchor("center"),
      color(0, 0, 0),
      z(1002),
    ]);

    button.onClick(onClickAction);

    button.onHover(() => {
      button.color = rgb(180, 180, 255);
    });

    button.onHoverEnd(() => {
      button.color = rgb(200, 200, 255);
    });

    return { button, textLabel };
  }

  // Global paused flag
  let isPaused = false;
  let curTween = null;

  // Pause menu UI setup
  const pauseMenu = add([
    rect(300, 400),
    color(255, 255, 255),
    outline(4),
    anchor("center"),
    pos(center().add(0, 700)), // hidden below screen initially
    z(1000), // make sure it's on top
    "pauseMenu",
    fixed(),
    layer("ui"),
  ]);

  pauseMenu.hidden = true;
  pauseMenu.paused = true;

  // Toggle pause with "p"
  onKeyPress("p", () => {
    isPaused = !isPaused;

    // Cancel existing animation if any
    if (curTween) curTween.cancel();

    // Animate menu in or out
    curTween = tween(
      pauseMenu.pos,
      isPaused ? center() : center().add(0, 700),
      0.6,
      (p) => (pauseMenu.pos = p),
      easings.easeOutElastic
    );

    if (isPaused) {
      pauseMenu.hidden = false;
      pauseMenu.paused = false;
    } else {
      curTween.onEnd(() => {
        pauseMenu.hidden = true;
        pauseMenu.paused = true;
      });
    }
  });

  addPauseButton("Resume", -130, () => {
    isPaused = false;
    console.log("Resuming game");
    if (curTween) curTween.cancel();

    curTween = tween(
      pauseMenu.pos,
      center().add(0, 700),
      0.6,
      (p) => (pauseMenu.pos = p),
      easings.easeOutElastic
    );

    curTween.onEnd(() => {
      pauseMenu.hidden = true;
      pauseMenu.paused = true;
    });
  });

  addPauseButton("Save Game", -80, () => {
    window.parent.postMessage(
      {
        message: "Save game",
        position: { transferGlobalX: globalX, transferGlobalY: globalY },
        thisScene: getSceneName(),
      },
      "http://localhost:5173"
    );
  });
});

k.scene("wizard_dialogue", () => {
  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0)]);

  const DIALOG_WIDTH = 500;
  const DIALOG_HEIGHT = 140;
  const BUTTON_WIDTH = 460;
  const BUTTON_HEIGHT = 35;

  const dialogBox = k.add([
    k.rect(DIALOG_WIDTH, DIALOG_HEIGHT),
    k.pos(
      (k.width() - DIALOG_WIDTH) / 2,
      (k.height() - DIALOG_HEIGHT) / 2 - 80
    ),
    k.color(255, 255, 255),
    k.outline(4),
    k.z(10),
  ]);

  const dialogText = k.add([
    k.text("", { size: 24, width: DIALOG_WIDTH - 40 }),
    k.pos(
      (k.width() - DIALOG_WIDTH) / 2 + 20,
      (k.height() - DIALOG_HEIGHT) / 2 - 70
    ),
    k.color(0, 0, 0),
    k.z(11),
  ]);

  const choices = [];

  function clearChoices() {
    for (const c of choices) {
      c.destroy();
    }
    choices.length = 0;
  }

  function showDialog(text, options) {
    dialogText.text = text;
    clearChoices();

    if (options) {
      const totalHeight = options.length * (BUTTON_HEIGHT + 10);
      const startY = (k.height() + DIALOG_HEIGHT) / 2 - totalHeight / 2 + 20;

      options.forEach((opt, i) => {
        const x = (k.width() - BUTTON_WIDTH) / 2;
        const y = startY + i * (BUTTON_HEIGHT + 10);

        const btn = k.add([
          k.rect(BUTTON_WIDTH, BUTTON_HEIGHT),
          k.pos(x, y),
          k.color(200, 200, 255),
          k.area(),
          k.z(12),
          { action: opt.onSelect },
        ]);

        k.add([
          k.text(opt.text, { size: 20 }),
          k.pos(x + 10, y + 5),
          k.color(0, 0, 0),
          k.z(13),
        ]);

        btn.onClick(() => {
          opt.onSelect();
        });

        choices.push(btn);
      });
    }
  }

  // Start the dialogue
  function haveDialog() {
    showDialog("You see a mysterious figure. What do you do?", [
      {
        text: "Talk to them",
        onSelect: () => {
          showDialog("They nod and say hello.");
          wait(1, () => {
            haveDialog();
          });
        },
      },
      {
        text: "Run away",
        onSelect: () => {
          showDialog("You run. Coward.");
          globalX -= 64;
          globalY -= 64;
          wait(1, () => {
            go("town");
          });
        },
      },
      {
        text: "Draw your sword",
        onSelect: () => {
          showDialog("They raise an eyebrow. 'Really?'");
          try {
            wait(1, () => {
              window.parent.postMessage(
                "battle initiated",
                "http://localhost:5173"
              );
            });
          } catch (error) {
            console.error("Error initiating battle:", error);
          }
          //eventually go to combat
        },
      },
    ]);
  }
  haveDialog();

  window.addEventListener("message", (event) => {
    if (event.data === "Proof completed! YAY!") {
      console.log("Proof completed!");
    }
  });

  window.addEventListener("message", (event) => {
    if (event.data === "Proof completed! YAY!") {
      showDialog("You have completed the proof! The wizard nods in approval.", [
        {
          text: "Continue",
          onSelect: () => {
            go("town");
          },
        },
      ]);
    }
  });
});

onClick(() => addKaboom(mousePos()));

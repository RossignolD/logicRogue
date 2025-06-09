## Structure of the Encounter Data

Each Encounter is able to be reconstituted from the following:

- Puzzle
- Show line (string)
- Premises (string) Optional?
- Par (int)

## Structure of NPC Data

- Name (random)
- Job
- Ability
- Home base

### NPC Dialogue Data

- Pre-encountering
- Encountering
- Post-encountering

### Structure of Player Data

<!-- - Player name (random but vetoable) (nice to have but not going to be in right now) -->

- Abilities unlocked (array of strings) (Being handled in react as encounters are being handled there)
- Player coordinates (Object containing x and y coordinates)
- Scene
<!-- - Active NPC (int)(nice to have but not going to be in right now)
- Sprite info(nice to have but not going to be in right now)
- Dialogue State (object with keys are NPCs, values are dialogue state for that NPC )(nice to have but not going to be in right now)
  - Possible states are "Not encountered", "Encountered", "Encountered successfully", "Encountered unsuccessfully" -->

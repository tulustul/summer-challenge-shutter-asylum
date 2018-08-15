import { Cell } from './level.interface';
import { Vector2 } from './vector.js';
import { TILE_SIZE } from './constants.js';
import { EntityEngine } from "./systems/ecs.js";
import { PlayerComponent } from "./systems/player.js";
import { PropComponent } from "./systems/props.js";
import { BarrierComponent } from './systems/barrier.js';
import { AIComponent } from './systems/ai.js';

export async function loadLevel(engine: EntityEngine, levelName: string): Promise<void> {
  const response = await fetch(`../levels/${levelName}.txt`, {});
  const data = await response.text();
  const cells = data.split('\n').map(line => Array.from(line)) as Cell[][];

  for (let y = 0; y < cells.length; y++) {
    const line = cells[y];
    for (let x = 0; x < line.length; x++) {
      const pos = new Vector2(x * TILE_SIZE, y * TILE_SIZE);
      if (line[x] === "S") {
        new PlayerComponent(engine, Object.create(pos));
        new PropComponent(engine, pos, "floor");
      } else if (line[x] === "E") {
        new AIComponent(engine, Object.create(pos));
        new PropComponent(engine, pos, "floor");
      } else if (line[x] === ".") {
        new PropComponent(engine, pos, "floor");
      } else if (line[x] === "X") {
        new BarrierComponent(engine, pos, "wall");
      }
    }
  }
}

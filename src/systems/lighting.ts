import { EntitySystem, EntityEngine, Entity } from "./ecs";
import { PropComponent } from "./props";
import { Vector2 } from "../vector";
import { ColisionSystem, Collidable, Shape } from "./colision";

interface LightOptions {
  physical?: boolean;
  enabled: boolean;
  broken?: boolean;
  size: number;
}

const updateFrequency = 0;

export class LightComponent extends Entity {

  colision: Collidable;

  prop: PropComponent;

  lastUpdated = 0;

  constructor(
    private engine: EntityEngine,
    public pos: Vector2,
    public options: LightOptions,
  ) {
    super();

    if (this.options.physical) {
      this.colision = this.engine.getSystem<ColisionSystem>(ColisionSystem).makeCollidable({
        pos,
        shape: Shape.circle,
        radius: 0,
        canHit: false,
        canReceive: true,
        shouldDecouple: false,
        parent: this,
      });

      this.prop = new PropComponent(this.engine, {pos, sprite: 'light'});
    }

    engine.getSystem(LightsSystem).add(this);
  }

  // destroy() {
  //   super.destroy()
    // if (this.options.physical) {
    // }
  // }
}

export class LightsSystem extends EntitySystem<LightComponent> {

  needRerender = true;

  update() {
    for (const light of this.entities) {
      if (light.options.broken) {
        if (this.engine.time - light.lastUpdated > updateFrequency) {
          if (Math.random() > 0.9) {
            light.options.enabled = !light.options.enabled;
            light.lastUpdated = this.engine.time;
            this.needRerender = true;
          }
        }
      }
    }
  }
}

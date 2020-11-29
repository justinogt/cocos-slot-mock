import Aux from '../SlotEnum';
import { routine } from '../Utils';
import Reel from './Reel';

const { ccclass, property } = cc._decorator;

export enum MachineState {
  Stopped,
  Spinning
}

@ccclass
export default class Machine extends cc.Component {
  @property(cc.Prefab)
  public _reelPrefab = null;

  @property({ type: cc.Prefab })
  get reelPrefab(): cc.Prefab {
    return this._reelPrefab;
  }

  set reelPrefab(newPrefab: cc.Prefab) {
    this._reelPrefab = newPrefab;
    this.node.removeAllChildren();

    if (newPrefab !== null) {
      this.createMachine();
    }
  }

  @property({ type: cc.Integer })
  public _numberOfReels = 3;

  @property({ type: cc.Integer, range: [3, 6], slide: true })
  get numberOfReels(): number {
    return this._numberOfReels;
  }

  set numberOfReels(newNumber: number) {
    this._numberOfReels = newNumber;

    if (this.reelPrefab !== null) {
      this.createMachine();
    }
  }

  public state: MachineState = MachineState.Stopped;

  private reels: Reel[]  = [];

  createMachine(): void {
    this.node.destroyAllChildren();
    this.reels = [];

    let newReel: cc.Node;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      newReel = cc.instantiate(this.reelPrefab);
      this.node.addChild(newReel);

      const reelScript = newReel.getComponent(Reel);
      reelScript.shuffle();
      reelScript.reelAnchor.getComponent(cc.Layout).enabled = false;
      this.reels[i] = reelScript;
    }

    this.node.getComponent(cc.Widget).updateAlignment();
  }

  spin(): void {
    this.state = MachineState.Spinning;

    for (let i = 0; i < this.numberOfReels; i += 1) {
      const theReel = this.reels[i];

      if (i % 2) {
        theReel.spinDirection = Aux.Direction.Down;
      } else {
        theReel.spinDirection = Aux.Direction.Up;
      }

      theReel.doSpin(0.03 * i);
    }
  }

  async stop(result: Array<Array<number>> = null) {
    const routines = [];
    const rngMod = Math.random() / 2;
    for (let i = 0; i < this.numberOfReels; i += 1) {
      const spinDelay = i < 2 + rngMod ? i / 4 : rngMod * (i - 2) + i / 4;

      routines.push(
        routine(spinDelay * 1000, () => this.reels[i].readyStop(result[i]))
      );
    }

    await Promise.all([...routines, routine(250)]);

    this.state = MachineState.Stopped;
  }
}

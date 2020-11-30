import CharactersResource from "./CharactersResource";
import Machine, { MachineState } from "./slots/Machine";
import SpinButton from "./SpinButton";
import { randomInteger, atomicRoutineDelay } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property({ type: Machine })
  machine: Machine = null;

  @property({ type: SpinButton })
  spinButton: SpinButton = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  private chance = [];
  private percentage7 = [];
  private percentage10 = [];
  private percentage33 = [];

  start() {
    this.machine.createMachine();

    for (let i = 0; i < 50; i++)
      this.chance.push(i);
    this.percentage7 = this.chance.slice(0, 7);
    this.percentage10 = this.chance.slice(7, 17);
    this.percentage33 = this.chance.slice(17, 50);
  }

  async click() {
    cc.audioEngine.playEffect(this.audioClick, false);

    switch (this.machine.state) {
      case MachineState.Spinning:
        this.spinButton.interactable(false);

        await this.machine.stop(await this.getAnswer());

        const winnerTiles = this.machine.reels.map(reel => reel.winnerTiles);
        for (const reelTiles of winnerTiles) {
          for (const tile of reelTiles)
            tile.setWinner();
        }

        this.spinButton.changeTo('SPIN').interactable(true);
        break;
      case MachineState.Stopped:
        this.machine.spin();
        this.spinButton.changeTo('STOP');
        break;
    }
  }

  async getAnswer(): Promise<Array<Array<number>>> {
    return await atomicRoutineDelay(1000 + 500 * Math.random(), () => {
      const rnd = randomInteger(0, 100);

      if (this.percentage7.indexOf(rnd) !== -1)
        return this.getReelsResult([0, 1, 2]);

      if (this.percentage10.indexOf(rnd) !== -1) {
        const lines = [0, 1, 2];
        lines.splice(randomInteger(0, 3), 1);
        return this.getReelsResult(lines);
      }

      if (this.percentage33.indexOf(rnd) !== -1)
        return this.getReelsResult([randomInteger(0, 3)]);

      return [];
    });
  }

  private getReelsResult(lines: number[]) {
    const tiles = [
      CharactersResource.instance.getRandomIndex(),
      CharactersResource.instance.getRandomIndex(),
      CharactersResource.instance.getRandomIndex()
    ];
    return this.machine.reels.map(_ => {
      const reels = [-1, -1, -1];
      for (let i = 0; i < lines.length; i++)
        reels[lines[i]] = tiles[i];
      return reels;
    });
  }
}

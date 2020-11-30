import CharactersResource from "./CharactersResource";
import Machine, { MachineState } from "./slots/Machine";
import SpinButton from "./SpinButton";
import { randomInteger, atomicRoutine } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property({ type: Machine })
  machine: Machine = null;

  @property({ type: SpinButton })
  spinButton: SpinButton = null;

  @property({ type: cc.AudioClip })
  audioClick = null;

  start() {
    this.machine.createMachine();
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
    const getReelsResult = (lines: number[]) => {
      console.log(lines);
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

    return await atomicRoutine(1000 + 500 * Math.random(), () => {
      const rnd = Math.random();

      if (rnd <= 0.07)
        return getReelsResult([0, 1, 2]);

      if (rnd <= 0.1) {
        const lines = [0, 1, 2];
        lines.splice(randomInteger(0, 3), 1);
        return getReelsResult(lines);
      }

      if (rnd <= 0.33)
        return getReelsResult([0, 2]);

      return [];
    });
  }
}

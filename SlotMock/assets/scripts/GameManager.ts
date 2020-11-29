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

        this.spinButton.changeTo('SPIN').interactable(true);
        break;
      case MachineState.Stopped:
        this.machine.spin();
        this.spinButton.changeTo('STOP');
        break;
    }
  }

  async getAnswer(): Promise<Array<Array<number>>> {
    const result = await atomicRoutine(1000 + 500 * Math.random(), () => {
      const rnd = Math.random();

      if (rnd <= 0.07) {
        const tile1 = CharactersResource.instance.getRandomIndex();
        const tile2 = CharactersResource.instance.getRandomIndex();
        const tile3 = CharactersResource.instance.getRandomIndex();
        const result = [];
        for (let i = 0; i < this.machine.numberOfReels; i++) {
          result.push([tile1, tile2, tile3]);
        }
        return result;
      }

      if (rnd <= 0.1) {
        let lines = [0, 1, 2];
        const winnerLine1 = lines[randomInteger(0, 3)];
        lines = lines.filter(item => item !== winnerLine1);
        const winnerLine2 = lines[randomInteger(0, 2)];
        
        const tile1 = CharactersResource.instance.getRandomIndex();
        const tile2 = CharactersResource.instance.getRandomIndex();

        const result = [];
        for (let i = 0; i < this.machine.numberOfReels; i++) {
          const reel = [
            CharactersResource.instance.getRandomIndex(),
            CharactersResource.instance.getRandomIndex(),
            CharactersResource.instance.getRandomIndex()
          ];
          reel[winnerLine1] = tile1;
          reel[winnerLine2] = tile2;
          result.push(reel);
        }
        return result;
      }

      if (rnd <= 0.33) {
        const winnerLine = randomInteger(0, 3);
        const tile = CharactersResource.instance.getRandomIndex();
        const result = [];
        for (let i = 0; i < this.machine.numberOfReels; i++) {
          const reel = [
            CharactersResource.instance.getRandomIndex(),
            CharactersResource.instance.getRandomIndex(),
            CharactersResource.instance.getRandomIndex()
          ];
          reel[winnerLine] = tile;
          result.push(reel);
        }
        return result;
      }

      return [];
    });
    
    

    return result;
  }
}

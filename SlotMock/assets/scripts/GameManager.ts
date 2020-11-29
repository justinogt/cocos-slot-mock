import Machine, { MachineState } from "./slots/Machine";
import SpinButton from "./slots/SpinButton";
import { routine } from "./Utils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {
  @property({ type: Machine })
  machine = null;

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

  getAnswer(): Promise<Array<Array<number>>> {
    return routine(1000 + 500 * Math.random(), () => []);
  }
}

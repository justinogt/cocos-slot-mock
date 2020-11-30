import Aux from '../SlotEnum';
import Tile from './Tile';

const { ccclass, property } = cc._decorator;

@ccclass
export default class Reel extends cc.Component {
  @property({ type: cc.Node })
  public reelAnchor = null;

  @property({ type: cc.Enum(Aux.Direction) })
  public spinDirection = Aux.Direction.Down;

  public stopSpinning = false;

  public tiles: Tile[] = [];

  public winnerTiles: Tile[] = [];

  private result: Array<number> = [];

  private resolveStop = null;

  start() {
    this.tiles = this.node.getComponentsInChildren<Tile>(Tile);
  }

  shuffle(): void {
    for (let i = 0; i < this.tiles.length; i += 1) {
      this.tiles[i].setRandom();
    }
  }

  readyStop(newResult: Array<number>, resolve): void {
    const check = this.spinDirection === Aux.Direction.Down || newResult == null;
    this.result = check ? newResult : newResult.reverse();
    this.stopSpinning = true;
    this.winnerTiles = [];
    this.resolveStop = resolve;
  }

  changeCallback(element: cc.Node = null): void {
    const el = element;
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;
    if (el.position.y * dirModifier > 288) {
      el.position = cc.v2(0, -288 * dirModifier);

      let pop = null;
      if (this.result != null && this.result.length > 0) {
        pop = this.result.pop();
      }

      if (pop != null && pop >= 0) {
        const tile = el.getComponent('Tile');
        this.winnerTiles.push(tile);
        tile.setTile(pop);
      } else {
        el.getComponent('Tile').setRandom();
      }
    }
  }

  checkEndCallback(element: cc.Node = null): void {
    const el = element;
    if (this.stopSpinning) {
      this.getComponent(cc.AudioSource).play();
      this.doStop(el);
    } else {
      this.doSpinning(el);
    }
  }

  doSpin(windUp: number): void {
    this.stopSpinning = false;

    this.reelAnchor.children.forEach(element => {
      const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

      const delay = cc.tween(element).delay(windUp);
      const start = cc.tween(element).by(0.25, { position: cc.v2(0, 144 * dirModifier) }, { easing: 'backIn' });
      const doChange = cc.tween().call(() => this.changeCallback(element));
      const callSpinning = cc.tween(element).call(() => this.doSpinning(element, 5));

      delay
        .then(start)
        .then(doChange)
        .then(callSpinning)
        .start();
    });
  }

  doSpinning(element: cc.Node = null, times = 1): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween().by(0.04, { position: cc.v2(0, 144 * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const repeat = cc.tween(element).repeat(times, move.then(doChange));
    const checkEnd = cc.tween().call(() => this.checkEndCallback(element));

    repeat.then(checkEnd).start();
  }

  doStop(element: cc.Node = null): void {
    const dirModifier = this.spinDirection === Aux.Direction.Down ? -1 : 1;

    const move = cc.tween(element).by(0.04, { position: cc.v2(0, 144 * dirModifier) });
    const doChange = cc.tween().call(() => this.changeCallback(element));
    const end = cc.tween().by(0.2, { position: cc.v2(0, 144 * dirModifier) }, { easing: 'bounceOut' });
    const completed = cc.tween().call(() => this.resolveStop());

    move
      .then(doChange)
      .then(move)
      .then(doChange)
      .then(end)
      .then(doChange)
      .then(completed)
      .start();
  }
}

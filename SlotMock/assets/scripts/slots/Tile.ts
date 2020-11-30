import CharactersResource from "../CharactersResource";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  @property({ type: cc.Node })
  public glow: cc.Node = null;

  private sprite: cc.Sprite;

  start() {
    this.sprite = this.node.getComponent(cc.Sprite);
    this.setRandom();
  }

  setWinner() {
    this.glow.active = true;
  }
  setNormal() {
    this.glow.active = false;
  }

  setTile(index: number) {
    this.sprite.spriteFrame = CharactersResource.instance.getAt(index);
  }

  setRandom() {
    this.sprite.spriteFrame = CharactersResource.instance.getRandom();
  }
}

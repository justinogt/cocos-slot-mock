import CharactersResource from "../CharactersResource";

const { ccclass } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  private sprite: cc.Sprite;
  private glow: cc.Node;

  start() {
    this.sprite = this.node.getComponent(cc.Sprite);
    this.glow = this.node.getChildByName('glow');
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
    console.log('dsnadsla');
    this.sprite.spriteFrame = CharactersResource.instance.getRandom();
  }
}

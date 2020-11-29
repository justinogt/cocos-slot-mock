import CharactersResource from "../CharactersResource";

const { ccclass } = cc._decorator;

@ccclass
export default class Tile extends cc.Component {
  private sprite: cc.Sprite;

  start() {
    this.sprite = this.node.getComponent(cc.Sprite);
  }

  setTile(index: number) {
    this.sprite.spriteFrame = CharactersResource.instance.getAt(index);
  }

  setRandom() {
    this.sprite.spriteFrame = CharactersResource.instance.getRandom();
  }
}

import { lazyRoutine, randomInteger } from "./Utils";

const {ccclass, property} = cc._decorator;

interface ICharactersResource {
  getAt(index: number): cc.SpriteFrame;
  getRandom(): cc.SpriteFrame;
}

@ccclass
export default class CharactersResource extends cc.Component implements ICharactersResource {
  private static _instance: ICharactersResource = null;
  static get instance() {
    if (this._instance === null) {
      const node = new cc.Node("CharactersResource");
      this._instance = node.addComponent<CharactersResource>(CharactersResource);
    }
    return this._instance;
  }
  static set instance(value: ICharactersResource) {
    if (this._instance === null)
      this._instance = value;
  }

  @property({ type: [cc.SpriteFrame], visible: true })
  private textures = [];

  getRandom() {
    return this.textures[randomInteger(0, this.textures.length)];
  }
  getAt(index: number) {
    return this.textures[index];
  }

  async onLoad() {
    CharactersResource.instance = this;
    await this.loadTextures();
  }

  async resetInEditor() {
    await this.loadTextures();
  }

  async loadTextures() {
    const self = this;
    return lazyRoutine<void>(resolve => {
      cc.loader.loadResDir('gfx/Square', cc.SpriteFrame, function afterLoad(err, loadedTextures) {
        self.textures = loadedTextures;
        resolve();
      });
    })
  }
}

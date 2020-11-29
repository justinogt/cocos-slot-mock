const { ccclass } = cc._decorator;

@ccclass
export default class SpinButton extends cc.Component {
    private button: cc.Button;
    private label: cc.Label;

    start() {
        this.button = this.getComponent(cc.Button);
        this.label = this.node.getChildByName("Label").getComponent(cc.Label);
    }

    changeTo(text: string) {
        this.label.string = text;
        return this;
    }

    interactable(interactable: boolean) {
        this.button.interactable = interactable;
    }
}
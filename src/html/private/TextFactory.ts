import { BaseFactory } from "../../components/private/BaseFactory.js";

export class TextFactory extends BaseFactory<Text> {

    constructor(
        protected readonly text: string
    ) {
        super(Text);
    }

    public override build(recycle?: Text | undefined): Text {
        if (recycle) {
            recycle.textContent = this.text;
            return recycle;
        }
        return document.createTextNode(this.text);
    }

}

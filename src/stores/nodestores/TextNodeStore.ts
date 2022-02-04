import { observable, action } from "mobx";
import { NodeStore } from "./NodeStore";

export class TextNodeStore extends NodeStore {

    constructor(initializer: Partial<TextNodeStore>) {
        /**
         An object of type Partial<TextNodeStore> means that the object passed into it will have the properties of a TextNodeStore (title and text, below), as well as the properties of a NodeStore, which it inherits from. 
         Additionally, the Partial<> bit makes all these properties optional, so the object passed in may not have all these properties.
         */
        super();
        Object.assign(this, initializer);

        /*
        the line above is equivalent to:

        this.x = initializer.x;
        this.y = initializer.y;
        this.title = initializer.title;
        this.text = initializer.text;
        */
    }

    @observable
    public text: string = "";

    @action 
    public setText(text: string): void {
        this.text = text;
    }

}
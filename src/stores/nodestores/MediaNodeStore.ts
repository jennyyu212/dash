import { observable } from "mobx";
import { NodeStore } from "./NodeStore";

export class MediaNodeStore extends NodeStore {

    constructor(initializer: Partial<MediaNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

    @observable
    public url: string;

}
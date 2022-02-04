import { NodeStore } from "./NodeStore";

export class AudioNodeStore extends NodeStore {

    constructor(initializer: Partial<AudioNodeStore>) {
        super();
        Object.assign(this, initializer);
    }

}
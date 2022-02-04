import { computed, observable, action } from "mobx";
import { Utils } from "../../Utils";
import { NodeCollectionStore } from "./NodeCollectionStore";

export enum StoreType {
    Text, Video, Image, Website, Audio
}

export class NodeStore {

    public Id: string = Utils.GenerateGuid();

    public type: StoreType = null;

    @observable
    public x: number = 0;

    @observable
    public y: number = 0;

    @observable
    public width: number = 0;

    @observable
    public height: number = 0;

    @computed
    public get transform(): string {
        return "translate(" + this.x + "px, " + this.y + "px)";
    }

    @observable
    public title: string = "Node Title";

    @action 
    public setTitle(title: string): void {
        this.title = title;
    }

    @observable
    public linkednodes: NodeStore[] = new Array<NodeStore>();

    @action 
    public addLinkedNode(node: NodeStore): void {
        this.linkednodes.push(node);
    }

    @action 
    public deleteLinkedNode(node: NodeStore): void {
        for (let i = 0; i < this.linkednodes.length; i++) {
            if (this.linkednodes[i] === node) {
                this.linkednodes.splice(i, 1);
                return;
            }
        }
    }

    @observable
    public parentNode: NodeCollectionStore = null;

    @observable
    public level: number;

}
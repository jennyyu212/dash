import { observable, action } from "mobx";
import { StoreType } from "./nodestores/NodeStore";
import { NodeStore } from "./nodestores/NodeStore";
import { NodeCollectionStore } from "./nodestores/NodeCollectionStore";
import { TextNodeStore } from "./nodestores/TextNodeStore";
import { MediaNodeStore } from "./nodestores/MediaNodeStore";
import { AudioNodeStore } from "./nodestores/AudioNodeStore";

export enum CanvasType {
    Freeform, Tree
}

interface NewLink {
    maker: NodeStore,
    receiver: NodeStore,
    action: LinkAction
}

interface Alert {
    message: string,
    type: AlertType,
}

export enum Action {
    AddNode, DeleteNode, AddCollection, AddLink, DeleteLink
}

export enum AlertType {
    error = "error", 
    warning = "warning", 
    info = "info", 
    success = "success"
}

interface Dialog {
    title: string,
    message: string,
    action: Action | null,
    payload: any,
    confirmed: boolean,
}

export enum LinkAction {
    Add, Delete
}

interface NewNode {
    parent: NodeCollectionStore,
    type: StoreType,
    x: number,
    y: number
}

interface NewCollection {
    parent: NodeCollectionStore,
    x: number,
    y: number
}

export class GlobalStore {

    // For changing display option

    @observable
    public display: CanvasType = CanvasType.Freeform;

    @action
    public setDisplay(display: CanvasType): void {
        this.display = display;
    }

    // For adding new nodes

    @observable
    public newNode: NewNode = null;

    @action
    public setNewNode(
        parent: NodeCollectionStore | null,
        type: StoreType | null, 
        x: number | null, 
        y: number | null): void {

        if (!this.newNode) {
            this.newNode = {parent, type, x, y}
        } else {
            if (parent) { this.newNode.parent = parent; }
            if (type) { this.newNode.type = type; }
            if (x) { this.newNode.x = x; }
            if (y) { this.newNode.y = y; }
        }
    }

    // For adding new collection

    @observable
    public newCollection: NewCollection = null;

    @action
    public setNewCollection(parent: NodeCollectionStore | null,
        x: number | null, 
        y: number | null):void {

        if (!this.newCollection) {
            this.newCollection = {parent, x, y}
        } else {
            if (parent) { this.newCollection.parent = parent; }
            if (x) { this.newCollection.x = x; }
            if (y) { this.newCollection.y = y; }
        }

    }

    // For selecting node

    @observable
    public selectedNode: NodeStore = null; 

    @action
    public setSelectedNode(node: NodeStore): void {
        this.selectedNode = node;
    }

    // For setting and clearing new links

    @observable
    public newlink: NewLink = null;

    @action
    public setNewLinkReceiver(node: NodeStore): void {
        this.newlink.receiver = node;
    }

    @action
    public setNewLink(maker: NodeStore, action: LinkAction): void {
        this.newlink = {maker: maker, receiver: null, action: action}
    }

    @action
    public clearLinks(): void {
        this.newlink = null;
    }

    // For setting and clearing alert

    @observable
    public alert: Alert = null;

    @action
    public setAlert(alert: Alert): void {
        this.alert = alert;
    }

    // For setting and clearing dialogs

    @observable
    public dialog: Dialog = null;

    @action
    public setDialog(title: string, message: string, action: Action, payload: any = null): void {
        this.dialog = {title: title, message: message, action: action, payload: payload, confirmed: false};
    }

    @action
    public confirmDialog(): void {
        this.dispatchAction(this.dialog.action, this.dialog.payload);
        this.clearDialog();

    }

    @action
    public clearDialog(): void {
        this.dialog = null;
    }

    /**
     * Called whenever an action is confirmed
     * @param action the action to be performed
     * @param payload the parameters required for the action
     */
    @action
    public dispatchAction(action: Action, payload: any = null) {

        const currentCollection = this.directories.slice(-1)[0] as NodeCollectionStore;

        switch (action) {
            case Action.DeleteNode:
                const deletedNode : NodeStore = this.dialog.payload as NodeStore;

                // Delete all associated links before deleting the node
                deletedNode.linkednodes.forEach(node => {
                    deletedNode.deleteLinkedNode(node);
                    node.deleteLinkedNode(deletedNode);
                })
                
                const index = currentCollection.nodes.indexOf(deletedNode);
                console.log(index);
                if (index > -1) {
                    currentCollection.nodes.splice(index, 1); 
                }
                break;

            case Action.AddNode: 
                
                if (this.newNode) {
                    let nodes = [];  
                    const parent = this.newNode.parent;   
                    const x = this.newNode.x;
                    const y = this.newNode.y;

                    switch (this.newNode.type) {
                        case null:
                            break;
            
                        case StoreType.Text:
                            nodes.push(new TextNodeStore({ type: StoreType.Text, x: x, y: y, width: 300, height: 300, text: "", title: "New Text Node", level: parent.level + 1, parentNode: parent}));
                            break;
            
                        case StoreType.Image:
                            nodes.push(new MediaNodeStore({ type: StoreType.Image, x: x, y: y, title: "New Image Node", width: 300, height: 300, level: parent.level + 1, parentNode: parent}));
                            break;
            
                        case StoreType.Website:
                            nodes.push(new MediaNodeStore({ type: StoreType.Website, x: x, y: y, title: "New Website Node", width: 300, height: 300, level: parent.level + 1, parentNode: parent}));
                            break;
                        
                        case StoreType.Audio:
                            nodes.push(new AudioNodeStore({ type: StoreType.Audio, x: x, y: y, title: "New Audio Node", width: 300, height: 300, level: parent.level + 1, parentNode: parent}));
                            break;
            
                    }

                    this.newNode.parent.addNodes(nodes);
                    this.newNode = null;
                }
                
                break; 
             

            case Action.AddCollection:  
                if (this.newCollection) {
                    let nodes = [];     
                    const parent = this.newCollection.parent;   
                    const x = this.newCollection.x;
                    const y = this.newCollection.y; 

                    nodes.push(new NodeCollectionStore({ x: x, y: y, width: 300, height: 300, title: "New Collection", parentNode: parent as NodeCollectionStore, level: parent.level + 1}));

                    this.newCollection.parent.addNodes(nodes);
                    this.newCollection = null;
                }
                break;

            case Action.AddLink:
                this.newlink.maker.addLinkedNode(this.newlink.receiver);
                this.newlink.receiver.addLinkedNode(this.newlink.maker);
                this.newlink = null;
                break;
            
            case Action.DeleteLink:
                this.newlink.maker.deleteLinkedNode(this.newlink.receiver);
                this.newlink.receiver.deleteLinkedNode(this.newlink.maker);
                this.newlink = null;
                break;

                 
        }
    }

    // For storing and editing the current directory path

    @observable
    public directories: NodeCollectionStore[] = [];

    @action
    public resetDirectory(): void {
        this.directories = [];
    }

    @action
    public appendDirectory(store: NodeCollectionStore): void {
        this.directories = [...this.directories, store];
    }

    /**
     * Removes n levels of directory
     * @param n number of directories to be removed
     */
    @action
    public removeDirectory(n: number): void {
        for (let i = 0; i < n; i++) {
            this.directories.pop();
        }
    }
    

}
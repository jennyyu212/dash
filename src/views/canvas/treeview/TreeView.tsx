import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../../stores/nodestores/NodeCollectionStore";
import "./TreeView.scss";
import * as React from 'react';
import { GlobalStore } from "../../../stores/GlobalStore";
import { TreeNode } from "./TreeNode"
import { StoreType } from "../../../stores/nodestores/NodeStore";
import { TextNodeStore } from "../../../stores/nodestores/TextNodeStore";
import { MediaNodeStore } from "../../../stores/nodestores/MediaNodeStore";
import { TextContent } from "../../nodes/content/TextContent"
import { MediaContent } from "../../nodes/content/MediaContent"
import { AlertType, Action } from "../../../stores/GlobalStore";

interface TreeViewProps {
    globalStore: GlobalStore
    store: NodeCollectionStore
}

@observer
export class TreeView extends React.Component<TreeViewProps> {

    state = { cursor: "auto", };

    // Resets the directory path when the canvas first loads
    componentDidMount() {
        this.props.globalStore.resetDirectory();
        this.props.globalStore.appendDirectory(this.props.store);
    }

    // Runs everytime when the data that this component is observing changes
    componentDidUpdate(): void {
        // If we are not yet in adding mode
        if (this.state.cursor != "crosshair") {
            // And we indicated that we want to add a new node or collection
            if ((this.props.globalStore.newNode) || (this.props.globalStore.newCollection)) {
                this.setState({cursor: "crosshair"});
            }
        }

        // If we are not in default mode
        if (this.state.cursor != "auto") {
            // And we don't want to add any new nodes or collections
            if ((!this.props.globalStore.newNode) && (!this.props.globalStore.newCollection)) {
                this.setState({cursor: "auto"});
            }
        } 
    }

    onClickAdd = (collection: NodeCollectionStore): (e: React.MouseEvent) => void => {
        return (e: React.MouseEvent): void => {
            const globalStore = this.props.globalStore
  
            e.stopPropagation();
            e.preventDefault();

            // Add new node
            if (this.props.globalStore.newNode) {
                globalStore.setNewNode(collection, undefined, 0, 0);
                globalStore.dispatchAction(Action.AddNode);
            }

            // Add new collection
            if (this.props.globalStore.newCollection) {
                globalStore.setNewCollection(collection, 0, 0);
                globalStore.dispatchAction(Action.AddCollection);
            }

        }
    }

    render() {
        let globalStore = this.props.globalStore;
        let store = this.props.store;
        let newNode = this.props.globalStore.newNode;
        let newCollection = this.props.globalStore.newCollection;
        let selectedNode = globalStore.selectedNode;

        

        return (
            <div className="treeview" style={{cursor: this.state.cursor}}>
                {   // maps each directory in the directory path to be rendered as a column

                    globalStore.directories.map(directory => {
                        if (directory.type === null) {
                                const collection = directory as NodeCollectionStore

                                let collections = [];
                                let rootNodes = [];
                                for (const value in Object.keys(StoreType)) {
                                    rootNodes.push([]);
                                }
                                // for each directory, maps out each item to be rendered as a tree node
                                collection.nodes.map(nodeStore => {
                                    if (nodeStore.type === null) {
                                        collections.push(<TreeNode globalStore={globalStore} store={nodeStore}/>);
                                    } else {
                                        rootNodes[nodeStore.type].push(<TreeNode globalStore={globalStore} store={nodeStore}/>)
                                    }
                                    
                                })

                                let thisLevel = [].concat.apply(collections, rootNodes);  
                                return <div onClick={this.state.cursor === "crosshair" ? this.onClickAdd(collection) : () => {}} className="level tree-folder">{thisLevel}</div>
                        }
                    })

                }
                
                {   // If we have a root node that is selected, render out its content in the last column
                    selectedNode &&
                    (() => { 
                            switch (selectedNode.type) {
                                case StoreType.Text:
                                    return <div className="level tree-node"><TextContent store={selectedNode as TextNodeStore} globalStore={globalStore}/></div>

                                case StoreType.Video:
                                case StoreType.Image:
                                case StoreType.Website:
                                    return <div className="level tree-node"><MediaContent store={selectedNode as MediaNodeStore} globalStore={globalStore}/></div>
                            }
                        })()
                }
                        
  
            </div>
        );
    }
}

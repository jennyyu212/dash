import { observer } from "mobx-react";
import { NodeStore } from "../../../stores/nodestores/NodeStore";
import "./TreeView.scss";
import * as React from 'react';
import { StoreType } from "../../../stores/nodestores/NodeStore";
import { GlobalStore, Action } from "../../../stores/GlobalStore";
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { NodeCollectionStore } from "../../../stores/nodestores/NodeCollectionStore";

interface TreeViewProps {
    globalStore: GlobalStore
    store: NodeStore
}


@observer
export class TreeNode extends React.Component<TreeViewProps> {

    handleExpand = (e: React.MouseEvent): void => {
        const globalStore = this.props.globalStore;
        const store = this.props.store;
        globalStore.setSelectedNode(store);

        // If we are clicking on one of the previous directories, 
        // we need to close the later directories before opening a new one
        const currentLevels = globalStore.directories.length;
        const levelsToBeExpanded = this.props.store.level + 2;
        if (currentLevels >= levelsToBeExpanded) {
            globalStore.removeDirectory(currentLevels - levelsToBeExpanded + 1);         
        } 
        
        // If we are clicking on a directory, we add it to the directory path list
        if (store.type === null) {
            globalStore.appendDirectory(store as NodeCollectionStore);
        }  
    
    }

    handleDeleteNode = (e: React.MouseEvent): void => {
        this.props.globalStore.setDialog(
            "Delete Node?", 
            "Once you delete it, you cannot restore it.", 
            Action.DeleteNode,
            this.props.store
        )
    }
    
    fileEmoji(type: StoreType): string {
        switch (type) {
            case StoreType.Text:
                return "📝"
            case StoreType.Video:
                return "🎞"
            case StoreType.Image:
                return "🖼"
            case StoreType.Website:
                return "📰"
        }
    }

    render() {
        let store = this.props.store;
        let globalStore = this.props.globalStore
        
        // A node is expanded if it's an opened directory or a selected node
        let expanded;
        if (store.type === null) {
            expanded = globalStore.directories.includes(this.props.store as NodeCollectionStore)
        } else {
            expanded = globalStore.selectedNode === store
        }

        return (
            <div className="treenode">
                {   // Renders the treenode based on the store type
                    (() => { 
                        switch (store.type) {
                            case null: 
                                return <p className={expanded ? "expanded" : ""} onClick={this.handleExpand}>{expanded ? "📂" : "📁"} {store.title}</p>

                            case StoreType.Text:
                            case StoreType.Video:
                            case StoreType.Image:
                            case StoreType.Website:
                                return <p className={expanded ? "expanded" : ""} onClick={this.handleExpand}>{this.fileEmoji(store.type)} {store.title}</p>
                        }
                    })()
                }
                
                {   // If this node is expanded, we add an icon for deleting the node
                    expanded ?
                    <IconButton color="primary" size="small" component="span" onClick={this.handleDeleteNode}>
                        <CloseIcon fontSize="small"/>
                    </IconButton> : <></>
                }
                
            </div>
        );
    }
}

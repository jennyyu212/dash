import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/nodestores/NodeCollectionStore";
import "./NodeView.scss";
import * as React from 'react';
import { NodeView } from './NodeView';
import { GlobalStore } from '../../stores/GlobalStore';
import Folder from '../../assets/folder.png'

interface CollectionNodeProps {
    globalStore: GlobalStore,
    store: NodeCollectionStore,
}

@observer
export class CollectionNodeView extends React.Component<CollectionNodeProps> {

    handleEnterCollection = (e: React.MouseEvent):void => {
        e.stopPropagation();
        // If the user double clicks on a folder, enters that folder
        if (e.detail == 2) {
            this.props.globalStore.appendDirectory(this.props.store);
        }
    }

    render() {
        let store = this.props.store;
        return (
            <NodeView store={store} globalStore={this.props.globalStore} onClick={this.handleEnterCollection}>
                <div className="folder">
                    <img style={{width: "80%"}} src={Folder}/>
                    <p className="text">{store.nodes.length}</p>
                </div>
            </NodeView>           
        );
    }
}
import { observer } from "mobx-react";
import { MediaNodeStore } from "../../stores/nodestores/MediaNodeStore";
import * as React from 'react';
import { NodeView } from './NodeView';
import { GlobalStore } from '../../stores/GlobalStore';
import { MediaContent } from "./content/MediaContent"

interface MediaNodeProps {
    globalStore: GlobalStore
    store: MediaNodeStore;
}

@observer
export class MediaNodeView extends React.Component<MediaNodeProps> {
    
    render() {
        let store = this.props.store;
        let globalStore = this.props.globalStore;

        return ( 
            <NodeView store={store} globalStore={globalStore}>
                <MediaContent store={store} globalStore={globalStore}/>
            </NodeView>
        );
    }
}

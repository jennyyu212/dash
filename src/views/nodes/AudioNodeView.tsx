import { observer } from "mobx-react";
import { AudioNodeStore } from "../../stores/nodestores/AudioNodeStore";
import "./NodeView.scss";
import * as React from 'react';
import { NodeView } from './NodeView';
import { GlobalStore } from '../../stores/GlobalStore';

interface AudioNodeProps {
    globalStore: GlobalStore
    store: AudioNodeStore;
}

@observer
export class AudioNodeView extends React.Component<AudioNodeProps> {

    state = {
        recordState: null
    }

    render() {
        let store = this.props.store;
        let globalStore = this.props.globalStore;

        
        return ( 
            <NodeView store={store} globalStore={globalStore}>
                <p>Sorry this feature is still under development 😥</p>
                <p>Please come back at another time</p>
                
            </NodeView>
        );
    }
}

import { observer } from "mobx-react";
import "./NodeView.scss";
import * as React from 'react';
import RichTextEditor, { ToolbarConfig } from 'react-rte';
import { TextNodeStore } from "../../stores/nodestores/TextNodeStore";
import { GlobalStore } from '../../stores/GlobalStore';
import { NodeView } from './NodeView';
import { TextContent } from './content/TextContent'


interface TextNodeProps {
    globalStore: GlobalStore
    store: TextNodeStore;
}

@observer
export class TextNodeView extends React.Component<TextNodeProps> {

    render() {
        let store = this.props.store;
        let globalStore = this.props.globalStore;
        
        return (
            <NodeView store={store} globalStore={globalStore}>
                <TextContent store={store} globalStore={globalStore}/>
            </NodeView>
            
        );
    }
}
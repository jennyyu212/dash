import { observer } from "mobx-react";
import { MediaNodeStore } from "../../../stores/nodestores/MediaNodeStore";
import "../NodeView.scss";
import "./Content.scss";
import { StoreType } from '../../../stores/nodestores/NodeStore';
import * as React from 'react';
import { GlobalStore } from '../../../stores/GlobalStore';
import ReactDOM from 'react-dom'

interface MediaContentProps {
    globalStore: GlobalStore
    store: MediaNodeStore;
}

@observer
export class MediaContent extends React.Component<MediaContentProps> {

    onClick = (e: React.MouseEvent): void => {
        e.stopPropagation();
        this.props.globalStore.setSelectedNode(this.props.store);
    }

    // Triggered when the textbox loses focus
    // i.e. when user finishes editing the url
    onBlur = (e: React.FocusEvent): void => {
        if (this.props.store.url != (e.currentTarget as HTMLElement).textContent) {
            this.props.store.url = (e.currentTarget as HTMLElement).textContent;
        }
    }

    render() {
        let store = this.props.store;
        let editMode = this.props.globalStore.selectedNode == this.props.store;

        return ( 
            <div className="node content">
                {
                    (() => {
                        switch(this.props.store.type) {
                            case StoreType.Video:
                                return <iframe src={store.url} />;
                            case StoreType.Image:   
                                return <img src={store.url} />;
                            case StoreType.Website: 
                                return <iframe src={store.url} />
                                ;
                        }
                    })()
                }
                <p contentEditable={editMode} onPointerDown={(e) => e.stopPropagation()} onBlur={this.onBlur}>
                    {(!this.props.store.url || this.props.store.url === "") ? "Enter URL here" : this.props.store.url}
                </p>
            </div>
        );
    }
}

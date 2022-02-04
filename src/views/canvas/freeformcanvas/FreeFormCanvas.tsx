import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../../stores/nodestores/NodeCollectionStore";
import "./FreeFormCanvas.scss";
import * as React from 'react';
import { TextNodeStore } from "../../../stores/nodestores/TextNodeStore";
import { MediaNodeStore } from "../../../stores/nodestores/MediaNodeStore";
import { AudioNodeStore } from "../../../stores/nodestores/AudioNodeStore";
import { TextNodeView } from "../../nodes/TextNodeView";
import { AudioNodeView } from "../../nodes/AudioNodeView";
import { StoreType } from "../../../stores/nodestores/NodeStore";
import { MediaNodeView } from "../../nodes/MediaNodeView";
import { GlobalStore } from "../../../stores/GlobalStore";
import { CollectionNodeView } from "../../nodes/CollectionNodeView";
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Line } from '../../lines/Line';
import { Action } from "../../../stores/GlobalStore";


interface FreeFormProps {
    globalStore: GlobalStore
    rootStore: NodeCollectionStore
}

@observer
export class FreeFormCanvas extends React.Component<FreeFormProps> {

    state = { cursor: "auto" };
    private isPointerDown: boolean;
    
    // Resets the directory path when the canvas first loads
    componentDidMount() {
        this.props.globalStore.resetDirectory();
        this.props.globalStore.appendDirectory(this.props.rootStore);
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

    onClickAdd = (e: React.MouseEvent): void => {
        const globalStore = this.props.globalStore
        e.stopPropagation();
        e.preventDefault();

        // Get the clicked location
        const clickX = e.clientX - document.getElementById('freeformcanvas-container').offsetLeft;
        const clickY = e.clientY - document.getElementById('freeformcanvas-container').offsetTop;
        const currentStore = globalStore.directories.slice(-1)[0] as NodeCollectionStore

        // Add new node
        if (this.props.globalStore.newNode) {
            globalStore.setNewNode(currentStore, undefined, clickX, clickY);
            globalStore.dispatchAction(Action.AddNode);
        }
        
        // Add new collection
        if (this.props.globalStore.newCollection) {
            globalStore.setNewCollection(currentStore, clickX, clickY);
            globalStore.dispatchAction(Action.AddCollection);
        }

        
    }

    onClick = (e: React.MouseEvent): void => {
        // When we click onto the canvas, we deselect nodes
        this.props.globalStore.setSelectedNode(null);

         // If we are currently in adding-node mode
        if (this.state.cursor === "crosshair") {
            this.onClickAdd(e);
        }
    }
    

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
        this.isPointerDown = true;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;

        const currentStore = this.props.globalStore.directories.slice(-1)[0]

        currentStore.x += e.movementX;
        currentStore.y += e.movementY;
    }

    handleClickGoBack = (e: React.MouseEvent): void => {
        this.props.globalStore.removeDirectory(1);
    };

    render() {
        let rootStore = this.props.rootStore;
        let globalStore = this.props.globalStore;
        let newNode = this.props.globalStore.newNode;
        let newCollection = this.props.globalStore.newCollection;
        let currentStore = this.props.globalStore.directories.slice(-1)[0]

        return (
            <div id="freeformcanvas-container" onPointerDown={this.onPointerDown} style={{cursor: this.state.cursor}}>

                {   // when we are not in the root directory, renders a go-back button on the canvas
                    currentStore && (currentStore.parentNode != null) &&
                    <div className="go-back-button">
                        <IconButton color="primary" component="span" onClick={this.handleClickGoBack}>
                            <ArrowBackIosNewOutlinedIcon/>
                        </IconButton>
                    </div>
                }
                
                <div id="freeformcanvas" style={{ transform: rootStore.transform }} onClick={this.onClick}>

                    {   // maps each item in the store to be rendered in the canvas based on their node type
                        currentStore &&
                        currentStore.nodes.map(nodeStore => {
                            
                            switch (nodeStore.type) {
                                case null:
                                    return <CollectionNodeView key={nodeStore.Id} store={nodeStore as NodeCollectionStore} globalStore={globalStore}/>

                                case StoreType.Text:
                                    return (<TextNodeView key={nodeStore.Id} store={nodeStore as TextNodeStore} globalStore={globalStore}/>)

                                case StoreType.Video:
                                    return (<MediaNodeView key={nodeStore.Id} store={nodeStore as MediaNodeStore} 
                                        globalStore={globalStore}/>)

                                case StoreType.Image:
                                    return (<MediaNodeView key={nodeStore.Id} store={nodeStore as MediaNodeStore} 
                                        globalStore={globalStore} />)

                                case StoreType.Website:
                                    return (<MediaNodeView key={nodeStore.Id} store={nodeStore as MediaNodeStore} 
                                        globalStore={globalStore}/>)

                                case StoreType.Audio:
                                    return (<AudioNodeView key={nodeStore.Id} store={nodeStore as AudioNodeStore} 
                                        globalStore={globalStore}/>)

                                default:
                                    break;
                            }
                        })
                    }

                    {   // renders the links between components
                        currentStore &&
                        currentStore.nodes.map((nodeStore) => {
                            const lines = nodeStore.linkednodes.map(linkedNode => {
                                return (
                                    <Line key={nodeStore.Id + linkedNode.Id} node1={nodeStore} node2={linkedNode}/>
                                )
                            })
                            return lines;
                        })
                    }
                    
                </div>
                
            </div>
        );
    }
}

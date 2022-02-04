import { observer } from "mobx-react";
import "./NodeView.scss";
import { TopBar } from "./TopBar";
import { NodeStore } from '../../stores/nodestores/NodeStore';
import * as React from 'react';
import { Resizable } from './Resizable';
import IconButton from '@mui/material/IconButton';
import AddLinkIcon from '@mui/icons-material/AddLink';
import { Action, GlobalStore } from '../../stores/GlobalStore';
import { LinkAction } from '../../stores/GlobalStore';
import { AlertType } from '../../stores/GlobalStore';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import LinkOffIcon from '@mui/icons-material/LinkOff';

interface NodeProps {
    globalStore: GlobalStore,
    store: NodeStore,
    children: React.ReactNode,
    onClick?: (e: React.MouseEvent) => void;
}

@observer
export class NodeView extends React.Component<NodeProps> {

    state = { showLinksAnchorEl: null,
            colored: false }
    
    handleSelectNode = (e: React.MouseEvent): void => {
        // prevent the onPointerDown action on the canvas from being triggered
        e.stopPropagation();
        if (e.detail == 1) {
            this.props.globalStore.setSelectedNode(this.props.store);
        }
        // perform whatever click event this specific node wants to support
        if (this.props.onClick) {
            this.props.onClick(e); 
        }

        const globalStore = this.props.globalStore
        const newlink = globalStore.newlink;

        if (newlink) {
            console.log(this.props.store)
                // if this node did not initiate the linking
                if (newlink.maker != this.props.store) {

                    if (newlink.action == LinkAction.Add) {
                        if (!this.props.store.linkednodes.includes(newlink.maker)) {
                            // if this link does not already exist, add it
                            globalStore.setNewLinkReceiver(this.props.store);
                            globalStore.dispatchAction(Action.AddLink);
                            globalStore.setAlert({message: "Successfully added", type: AlertType.success })
                        } else {
                            globalStore.clearLinks();
                            globalStore.setAlert({message: "Link already exists", type: AlertType.error })
                        }
                    } else if (newlink.action == LinkAction.Delete) {

                        if (this.props.store.linkednodes.includes(newlink.maker)) {
                            // if this link exists, delete it
                            globalStore.setNewLinkReceiver(this.props.store);
                            globalStore.dispatchAction(Action.DeleteLink);
                            globalStore.setAlert({message: "Successfully deleted", type: AlertType.success })

                        } else {
                            globalStore.clearLinks();
                            globalStore.setAlert({message: "Link does not exist", type: AlertType.error })
                        }

                    }
                    
                }
        }
  
    }

    handleAddLink = (e: React.MouseEvent): void => {
        this.props.globalStore.setNewLink(this.props.store, LinkAction.Add);    
    }

    handleDeleteLink = (e: React.MouseEvent): void => {
        this.props.globalStore.setNewLink(this.props.store, LinkAction.Delete);      
    }

    handleDeleteNode = (e: React.MouseEvent): void => {
        this.props.globalStore.setDialog(
            "Delete Node?", 
            "Once you delete it, you cannot restore it.", 
            Action.DeleteNode,
            this.props.store)
    }

    render() {
        let store = this.props.store;
        let globalStore = this.props.globalStore;
        let editMode = globalStore.selectedNode == this.props.store;
        let newlink = globalStore.newlink;
        // if a node is selected, make it appear on the top
        let zIndex = editMode ? 99 : 1;

        let showLinks = Boolean(this.state.showLinksAnchorEl);
        

        if (newlink) {
            const nodes = Array.from(document.querySelectorAll('.node'));
            nodes.forEach(element => {
                element.classList.add('hover-border');
            });
        }

        return (    
            <div className="node-container" id={store.Id} style={{ transform: store.transform, zIndex: zIndex }} onClick={this.handleSelectNode}>
                <div className="node" style={{ width: store.width, height: store.height, background: this.state.colored ? "#F7F4EC" : "transparent"}}>
                <TopBar store={store} globalStore={globalStore}/>
                { editMode? 
                <Resizable store={store}>
                    <div className="content">{this.props.children}</div>
                </Resizable>: 
                <div className="content">{this.props.children}</div>
                }
                </div>
                {editMode && 
                    <div className="node-control-panel">

                        <div className="control">
                            <Tooltip title="Add Link">
                                <IconButton color="primary" aria-label="add link" component="span" onClick={this.handleAddLink}>
                                    <AddLinkIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>

                        <div className="control">
                            <Tooltip title="Delete Link">
                                <IconButton color="primary" aria-label="add link" component="span" onClick={this.handleDeleteLink}>
                                    <LinkOffIcon/>
                                </IconButton>
                            </Tooltip>
                            <p>{this.props.store.linkednodes.length}</p>
                        </div>

                        <ToggleButton
                            value = "colored"
                            size = "small"
                            color="primary"
                            selected={this.state.colored}
                            onChange={() => {
                                this.setState({colored: !this.state.colored});
                            }}
                            sx={{ border: "none", padding: "2px", margin: "13px 0px" }}
                            >
                            <FormatColorFillIcon/>
                        </ToggleButton>

                       
                        
                        <div className="control delete-button">
                            <Tooltip title="Delete Node">
                                <IconButton color="primary" aria-label="add link" component="span" onClick={this.handleDeleteNode}>
                                    <DeleteForeverIcon/>
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                }
                    
            </div> 
        );
    }
}

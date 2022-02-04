import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/nodestores/NodeCollectionStore";
import * as React from 'react';
import "./Canvas.scss";
import { GlobalStore, Action } from "../../stores/GlobalStore";
import { CanvasType } from "../../stores/GlobalStore";
import { FreeFormCanvas } from "./freeformcanvas/FreeFormCanvas"
import { TreeView } from "./treeview/TreeView"
import { CanvasHeader } from './CanvasHeader'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { AlertType } from "../../stores/GlobalStore";
import Snackbar from '@mui/material/Snackbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';


interface CanvasProps {
    globalStore: GlobalStore
    store: NodeCollectionStore
}

@observer
export class Canvas extends React.Component<CanvasProps> {

    getAlertMessage = (type: AlertType): string => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    }

    handleCloseAlert = (event: React.SyntheticEvent<Element, Event>) => {
        this.props.globalStore.setAlert(null);
    };

    render() {
        let globalStore = this.props.globalStore;
        let display = this.props.globalStore.display;
        let alert = this.props.globalStore.alert;
        let dialog = this.props.globalStore.dialog;
        let showAlert = alert != null;

        return (
            <div className="canvas-wrapper">

                <CanvasHeader globalStore={this.props.globalStore}/>

                <div className="canvas-body">  
                    {   // Renders the canvas based on the current type indicated in global store
                        (() => {
                            switch(display) {
                                case CanvasType.Freeform:
                                    console.log("freeform")
                                    return <FreeFormCanvas rootStore={this.props.store} globalStore={this.props.globalStore}/>
                                case CanvasType.Tree:   
                                    console.log("tree view")
                                    return <TreeView store={this.props.store} globalStore={this.props.globalStore}/>;
                                
                            }})()
                    }
                </div>
                
                {   // Alert pop up 
                    alert &&
                    <Snackbar open={showAlert} autoHideDuration={3000} onClose={this.handleCloseAlert}>
                        <Alert onClose={this.handleCloseAlert} severity={alert.type} sx={{ width: '100%' }}>
                            <AlertTitle>{this.getAlertMessage(alert.type)}</AlertTitle>
                            {alert.message}
                        </Alert>
                    </Snackbar>
                    
                }     

                {   // Dialog pop up 
                    dialog &&
                    <Dialog
                    open={dialog !== null}
                    >
                        <DialogTitle>{dialog.title}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>{dialog.message} </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => {globalStore.clearDialog()}}>Cancel</Button>
                            <Button onClick={() => {globalStore.confirmDialog()}} autoFocus>Confirm</Button>
                        </DialogActions>
                    </Dialog> 
                }
                 
             

            </div>
        );
    }
}

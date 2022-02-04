import { observer } from "mobx-react";
import { NodeCollectionStore } from "../../stores/nodestores/NodeCollectionStore";
import "./Canvas.scss";
import * as React from 'react';
// import HeaderIcon from '../../assets/swatches.png'
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { StoreType } from "../../stores/nodestores/NodeStore";
import { CanvasType } from "../../stores/GlobalStore";
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Button from '@mui/material/Button';
import { GlobalStore } from "../../stores/GlobalStore";
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';


interface CanvasHeaderProps {
    globalStore: GlobalStore
}

@observer
export class CanvasHeader extends React.Component<CanvasHeaderProps> {

    state = {
        addNodeAnchorEl: null,
        displayAnchorEl: null,
    }

    handleClose = (e: React.MouseEvent): void => {
        this.setState({addNodeAnchorEl: null});
        this.setState({displayAnchorEl: null});
    };

    // triggered when user clicks the add button
    handleClickAddNode = (e: React.MouseEvent): void => {
        this.setState({addNodeAnchorEl: e.currentTarget});
      };

    // triggered when user selects a type of node to be added
    handleAddNode = (e, index) => {
        // just set new node type to be index, because the enum StoreType is internally mapped to integers
        this.props.globalStore.setNewNode(undefined, index, undefined, undefined);
        this.setState({addNodeAnchorEl: null});
    };
s
    // triggered when user clicks the add button
    handleClickAddFolder = (e: React.MouseEvent): void => {
        this.props.globalStore.setNewCollection(undefined, undefined, undefined);
    };

    // triggered when user clicks the change display button
    handleClickDisplay = (e: React.MouseEvent): void => {
        this.setState({displayAnchorEl: e.currentTarget});
    }

    // triggered when user chooses a display
    handleChangeDisplay = (e: React.MouseEvent, index): void => {
        // only re-render if user selects a different display
        if (this.props.globalStore.display != index) {
            this.props.globalStore.setDisplay(index);
            this.setState({displayAnchorEl: null});
        }
    }


    StringIsNumber = (value) => (isNaN(Number(value)));

    render() {
        let display = this.props.globalStore.display;

        return (
            <div id="canvas-header">
                <ul>
                    <li>
                        <IconButton color="primary" aria-label="upload picture" component="span" onClick={this.handleClickAddNode}>
                            <AddIcon/>
                        </IconButton>
                    </li>
                    <li>
                        <IconButton color="primary" aria-label="upload picture" component="span" onClick={this.handleClickAddFolder}>
                            <CreateNewFolderOutlinedIcon/>
                        </IconButton>
                    </li>
                    <li>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            // aria-haspopup="listbox"
                            // aria-controls="lock-menu"
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={this.handleClickDisplay}
                            endIcon={<KeyboardArrowDownIcon/>}
                        >
                            {Object.values(CanvasType)[display]}
                        </Button> 
                    </li>
                    

                    {/* menu for adding node */}
                    <Menu
                        id="basic-menu"
                        anchorEl={this.state.addNodeAnchorEl}
                        open={Boolean(this.state.addNodeAnchorEl)}
                        onClose={this.handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >   
                        {Object.keys(StoreType).filter(this.StringIsNumber)
                        .map((option, index) => (
                            <MenuItem
                                key={option}
                                onClick={(event) => this.handleAddNode(event, index)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>

                    {/* menu for display */}
                    <Menu
                        id="basic-menu"
                        anchorEl={this.state.displayAnchorEl}
                        open={Boolean(this.state.displayAnchorEl)}
                        onClose={this.handleClose}
                        MenuListProps={{
                        'aria-labelledby': 'basic-button',
                        }}
                    >   
                        {Object.keys(CanvasType).filter(this.StringIsNumber)
                        .map((option, index) => (
                            <MenuItem
                                key={option}
                                selected={index === display}
                                onClick={(event) => this.handleChangeDisplay(event, index)}
                            >
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </ul>
                
            </div>
        );
    }
}

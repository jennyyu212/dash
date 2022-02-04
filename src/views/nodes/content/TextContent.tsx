import { observer } from "mobx-react";
import "./Content.scss";
import * as React from 'react';
import RichTextEditor, { ToolbarConfig } from 'react-rte';
import { TextNodeStore } from "../../../stores/nodestores/TextNodeStore";
import { GlobalStore } from '../../../stores/GlobalStore';


interface TextContentProps {
    globalStore: GlobalStore
    store: TextNodeStore;
}

@observer
export class TextContent extends React.Component<TextContentProps> {
      
    state = {
        value: RichTextEditor.createValueFromString(this.props.store.text, 'markdown')
    }

    onPointerDown = (e: React.PointerEvent): void => {
        e.stopPropagation();
    }

    onChange = (value: String): void => {
        this.setState({ value });
    };

    
    // Triggered everytime the component updates
    // i.e. when user edits the content of the text editor
        
    componentDidUpdate(prevProps: Readonly<TextContentProps>, prevState): void {
        // Test if the state did change
        if (prevState.value.toString("markdown") != this.state.value.toString("markdown")) {
            this.props.store.setText(this.state.value.toString("markdown"));
        }
    
      }

    // Configuration for the toolbar of the rich text editor
    toolbarConfig: ToolbarConfig = {
        // Optionally specify the groups to display (displayed in the order listed).
        display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN'],
        INLINE_STYLE_BUTTONS: [
            {label: 'Bold', style: 'BOLD'},
            {label: 'Italic', style: 'ITALIC'},
            {label: 'Underline', style: 'UNDERLINE'}
        ],
        BLOCK_TYPE_DROPDOWN: [
            {label: 'Normal', style: 'unstyled'},
            {label: 'Heading Large', style: 'header-one'},
            {label: 'Heading Medium', style: 'header-two'},
            {label: 'Heading Small', style: 'header-three'}
        ],
        BLOCK_TYPE_BUTTONS: [
            {label: 'UL', style: 'unordered-list-item'},
            {label: 'OL', style: 'ordered-list-item'}
        ]
    };

    toolbarConfigEmpty: ToolbarConfig = {
        display: [],
    }

    render() {
        let store = this.props.store;
        let text = this.props.store.text;
        let globalStore = this.props.globalStore;
        let selected = this.props.globalStore.selectedNode == store
        
        return (
            <div className="scroll-box" onPointerDown={this.onPointerDown}
            onWheel={(e: React.WheelEvent) => {
                e.stopPropagation();
                e.preventDefault();
            }}>
                <RichTextEditor
                    value={this.state.value}
                    onChange={this.onChange}
                    toolbarConfig={ selected ? this.toolbarConfig : this.toolbarConfigEmpty}
                />
            </div>
            
        );
    }
}
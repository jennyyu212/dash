import { observer } from "mobx-react";
import { NodeStore } from "../../stores/nodestores/NodeStore";
import "./NodeView.scss";
import * as React from 'react';
import { GlobalStore } from '../../stores/GlobalStore';

interface TopBarProps {
    store: NodeStore;
    globalStore: GlobalStore,
}

@observer
export class TopBar extends React.Component<TopBarProps> {

    private isPointerDown = false;

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

    onPointerMove = (e: MouseEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        if (!this.isPointerDown) return;

        this.props.store.x += e.movementX;
        this.props.store.y += e.movementY;
    }

    onBlur = (e: React.FocusEvent): void => {
        if (this.props.store.title != (e.currentTarget as HTMLElement).textContent) {
            this.props.store.setTitle((e.currentTarget as HTMLElement).textContent);
        }
    }

    render() {        
        return (
            <div className="top" onPointerDown={this.onPointerDown} onBlur={this.onBlur} contentEditable suppressContentEditableWarning>
                {this.props.store.title}
            </div>
        )
    }
}

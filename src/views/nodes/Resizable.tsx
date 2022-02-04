import { observer } from "mobx-react";
import { NodeStore } from "../../stores/nodestores/NodeStore";
import "./NodeView.scss";
import * as React from 'react';

interface ResizableProps {
    store: NodeStore;
    children: React.ReactNode;
}

enum ResizeHandle {
    nw, n, ne, e, se, s, sw, w
}

@observer
export class Resizable extends React.Component<ResizableProps> {

    private isPointerDown = false;
    private handleChosen = undefined;

    // Triggered when the resize handles are clicked
    onPointerDown = (e: React.PointerEvent, handle: ResizeHandle): void => {
        this.isPointerDown = true;
        this.handleChosen = handle;
        e.stopPropagation();
        e.preventDefault();
        document.removeEventListener("pointermove", this.onPointerMove);
        document.addEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
        document.addEventListener("pointerup", this.onPointerUp);
    }

    onPointerUp = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();
        this.isPointerDown = false;
        this.handleChosen = undefined;
        document.removeEventListener("pointermove", this.onPointerMove);
        document.removeEventListener("pointerup", this.onPointerUp);
    }

    onPointerMove = (e: PointerEvent): void => {
        e.stopPropagation();
        e.preventDefault();

        if (!this.isPointerDown) return;

        switch (this.handleChosen) {
            case (ResizeHandle.nw): {
                this.props.store.width -= e.movementX;
                this.props.store.height -= e.movementY;
                this.props.store.x += e.movementX;
                this.props.store.y += e.movementY;
                break;
            } 
            case (ResizeHandle.n): {
                this.props.store.height -= e.movementY;
                this.props.store.y += e.movementY;
                break;
            }
            case (ResizeHandle.ne): {
                this.props.store.width += e.movementX;
                this.props.store.height -= e.movementY;
                this.props.store.y += e.movementY;
                break;
            }
            case (ResizeHandle.e): {
                this.props.store.width += e.movementX;
                break;
            }
            case (ResizeHandle.se): {
                this.props.store.width += e.movementX;
                this.props.store.height += e.movementY;
                break;
            }
            case (ResizeHandle.s): {
                this.props.store.height += e.movementY;
                break;
            }
            case (ResizeHandle.sw): {
                this.props.store.width -= e.movementX;
                this.props.store.height += e.movementY;
                this.props.store.x += e.movementX;
                break;
            }
            case (ResizeHandle.w): {
                this.props.store.width -= e.movementX;
                this.props.store.x += e.movementX;
                break;
            }
        }
    }

    render() {
        return (
            <div className="resizable">
                <div className="resize-corner nw" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.nw)}}/>
                <div className="resize-corner ne" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.ne)}}/>
                <div className="resize-corner se" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.se)}}/>
                <div className="resize-corner sw" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.sw)}}/>  

                <div className="resize-side ns n" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.n)}}/>  
                <div className="resize-side ew e" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.e)}}/>  
                <div className="resize-side ns s" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.s)}}/>  
                <div className="resize-side ew w" onPointerDown={(e) => {this.onPointerDown(e, ResizeHandle.w)}}/>  
                {this.props.children}
            </div>
        );
    }
}

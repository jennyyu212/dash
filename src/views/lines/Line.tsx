import { observer } from "mobx-react";
import { NodeStore } from "../../stores/nodestores/NodeStore"
import "./Line.scss"

import * as React from 'react';


interface LineProps {
    // Id1: string,
    // Id2: string,
    node1: NodeStore
    node2: NodeStore
}

@observer
export class Line extends React.Component<LineProps> {
    
    linedraw(x1 : number, y1 : number, x2 : number, y2 : number) {
        this.addpoint(x1,y1);
        this.addpoint(x2,y2);
        if (x2 < x1) {
            var tmp;
            tmp = x2 ; x2 = x1 ; x1 = tmp;
            tmp = y2 ; y2 = y1 ; y1 = tmp;
        }
    
        var lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        var m = (y2 - y1) / (x2 - x1);
    
        var degree = Math.atan(m) * 180 / Math.PI;
    
        return (
            <div className='line' 
                style={{transform: `rotate(${degree}deg)`,
                        width: `${lineLength}px`,
                        position: "absolute",
                        top: y1 + "px",
                        left: x1 + "px"}} />
        );
    }
    
    addpoint(x,y) {
        var p=document.createElement('div');
        p.style.left=x+'px';
        p.style.top=y+'px';
        p.style.width='10px';
        p.style.height='10px';
        document.body.appendChild(p);
    }
    
    render() {
        let node1 = this.props.node1;
        let node2 = this.props.node2;

        let x1  = node1.x + node1.width / 2;
        let y1  = node1.y + node1.height / 2;
        let x2  = node2.x + node2.width / 2;
        let y2  = node2.y + node2.height / 2;
        
        return (
            this.linedraw(x1, y1, x2, y2)
        );
    }
}



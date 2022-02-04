import * as React from 'react';
import * as ReactDOM from 'react-dom';
import "./Main.scss";
import { NodeCollectionStore } from './stores/nodestores/NodeCollectionStore';
import { GlobalStore } from "./stores/GlobalStore";
import { Canvas } from './views/canvas/Canvas';
import { MediaNodeStore } from "./stores/nodestores/MediaNodeStore";
import { StoreType } from "./stores/nodestores/NodeStore";
import { TextNodeStore } from "./stores/nodestores/TextNodeStore";

const globalStore = new GlobalStore();
const mainNodeCollection = new NodeCollectionStore({level: 0});
ReactDOM.render((
    <div>
        <Canvas globalStore={globalStore} store={mainNodeCollection}/>
    </div>), document.getElementById('root'));


// Populate some sample data here

const artworks = new NodeCollectionStore({ x: 900, y: 250, width: 300, height: 300, title: "Visuals", parentNode: mainNodeCollection, level: 0});

let artwork_nodes = [];

const code = new NodeCollectionStore({ x: 100, y: 400, width: 300, height: 300, title: "Projects", parentNode: mainNodeCollection, level: 0});

let code_nodes = [];


artwork_nodes.push(new TextNodeStore({ type: StoreType.Text, x: 100, y: 20, width: 300, height: 300, title: "Intro", text: "Check out some of my graphics and video works in this folder!", level: 1, parentNode: artworks }));

code_nodes.push(new MediaNodeStore({ type: StoreType.Website, x: 150, y: 400, title: "College Trip Planner", width: 300, height: 300, url: "https://collegetripplanner.herokuapp.com/", level: 1 }));

code_nodes.push(new MediaNodeStore({ type: StoreType.Website, x: 100, y: 20, title: "Data Science Final Presentation", width: 300, height: 300, url: "https://www.youtube.com/embed/ZZXNvVmp3xY", level: 1, parentNode: code }))

artwork_nodes.push(new MediaNodeStore({ type: StoreType.Website, x: 800, y: 20, title: "TEDxBrownU Vision Promo Video", width: 300, height: 300, url: "https://drive.google.com/file/d/1AlcEGPkDiqn86-uiMKJRWAY3437MQlKy/preview", level: 1, parentNode: code }))

artwork_nodes.push(new MediaNodeStore({ type: StoreType.Website, x: 100, y: 180, title: "Designs", width: 300, height: 300, url: "https://drive.google.com/file/d/14BZdpf5bGMTquJtKsStO3qe4JfUuXssK/preview", level: 1, parentNode: code }))

artwork_nodes.push(new MediaNodeStore({ type: StoreType.Website, x: 120, y: 500, title: "TEDx Event Booklet", width: 300, height: 300, url: "https://drive.google.com/file/d/1WEvwa05v9M-0FxZ7dxkJ2sdcVVTWoz-u/preview", level: 1, parentNode: code }))

let note = new TextNodeStore({ type: StoreType.Text, x: 450, y: 230, width: 350, height: 320, title: "A Note for You", text: "Hey there!! Thank you for visiting 😎 I created this hypermedia workspace as a starter project for Brown University's DASH research group. 👾 You can create editable text nodes and embed image, video, website of your own on this site. (Note: if you want to embed an image from Google Drive, use the website node)", level: 0, linkednodes: [artworks, code]})

artworks.addLinkedNode(note);
code.addLinkedNode(note);

artworks.addNodes(artwork_nodes);
code.addNodes(code_nodes);

let main_nodes = [];
main_nodes.push(new TextNodeStore({ type: StoreType.Text, x: 500, y: 100, width: 200, height: 200, title: "Welcome!", text: "Jenny Yu's Workspace", level: 0 }));
main_nodes.push(new MediaNodeStore({ type: StoreType.Website, x: 30, y: 20, title: "Me!🥰", width: 300, height: 300, url: "https://drive.google.com/file/d/10hWTBnB0QCa0dcDKVsaG19VWOvM8JATs/preview", level: 0, parentNode: mainNodeCollection }))

main_nodes.push(artworks);
main_nodes.push(code);
main_nodes.push(note);

main_nodes.push(new TextNodeStore({ type: StoreType.Text, x: 450, y: 500, width: 350, height: 320, title: "👾👾👾", text: "The site may be a little buggy at the moment, but feel free to experiment with this space and leave a comment on my github page if you have any suggestions :>          Warmly, Jenny", level: 0}));

main_nodes.push(new TextNodeStore({ type: StoreType.Text, x: 900, y: 600, width: 350, height: 320, title: "✨✨", text: "My contact email is: jenny_yu2@brown.edu", level: 0}));

mainNodeCollection.addNodes(main_nodes);

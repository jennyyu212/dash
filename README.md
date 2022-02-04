# Dash Starter Project

## What is this

- A browser-based hypermedia system that helps knowledge workers explore informal relationships between documents
- Implemented using React, Typescript, and MobX

## How to compile and run
Make sure you are using node version 12
From the project directory, run
* `npm install` if you are running for the first time
* `npm start`

Then go to `http://localhost:1050` in Chrome or Firefox

## Project Structure
- `stores` 
    - stores the data for different types of nodes
    - `GlobalStore.ts` contains data and functions that are accessed by all components in the project
- `views`
    - `canvas`
        - Contains components related to the entire canvas (e.g. a freeformCanvas and a treeview)
    - `nodes`
        - Contains components related to the actual nodes
    - `lines`
        - a component that helps to render lines between nodes
- `Main.ts`
    - the root file rom which everything else is rendered
    - contains some sample nodes that are populated onto the canvas
- `Utils.ts`
    - defines static methods to be used elsewhere in the project

## Known Bugs
- Cannot move the nodes by dragging topbar when height is too small
- Cannot switch between different text nodes in tree view

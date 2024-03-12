import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Square from "./components/Square";
import RenderTest from "./RenderTest";

import './style.css'
import App from "./App"

//test
import { db } from "./App.js"
import * as database  from "firebase/database";

function Test() {

  function tableSetup(){
    var tableSetup = [];
    for(let i = 0; i < 6; i++){
        tableSetup.push([]);
        for(let j = 0; j < 6; j++){
            tableSetup[i].push();
            tableSetup[i][j] = {...tableSetup[i][j], position: {line: i, cell: j}};
        }
    }
    return(tableSetup);
}
console.log(tableSetup());
}

const node = document.getElementById("root");
const root = createRoot(node);
root.render(<App />);
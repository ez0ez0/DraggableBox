import React, { useState } from 'react';
import { isMobile } from "react-device-detect";
import Draggable from './components/Draggable';
import Box from './components/Box';
import './App.css';

const App = () =>{
  let zIndexListArr = [1, 2, 3, 4]; // basic box z-index 
  let list = [0, 1, 2, 3]; // basic box list
  let randomColorList = [`rgb(255, 219, 229)`, `rgb(252, 250, 210)`, `rgb(227, 255, 228)`, `rgb(227, 247, 255)`, `rgb(248, 227, 255)`];

  const [boxList, setBoxList] = useState(list);
  const [zIndexList, setZIndexList] = useState(zIndexListArr); 
  
  const [orderBoxBtnOnOff, setOrderBoxBtnOnOff] = useState(false); // arrange btn click 
  const [drag, setDrag] = useState(false); // dragging outside the box
  const [mousePos, setMousePos] = useState({x:0, y:0}); // mouse position
  const [boxDateTimeList, setBoxDateTimeList] = useState(new Array(list.length).fill(new Date().toLocaleString())); // manufactured time 
  const [draggableArea, setDraggableArea] = useState({right: window.innerWidth, bottom: window.innerHeight}); // Draggable area information

  const newBoxArr = () => {
    setBoxList((boxList) => [...boxList, boxList.length]);
    setZIndexList((zIndexList) => [...zIndexList, zIndexList.length+1]);
    setBoxDateTimeList( [...boxDateTimeList, new Date().toLocaleString()] );
  }

  const orderBoxBtnSwitch = () => {
    setOrderBoxBtnOnOff(true);
  }

  

  return (
      <Draggable drag={drag} setDrag={setDrag} setMousePos={setMousePos} setDraggableArea={setDraggableArea}>
        <div className='menuBar'>
          <div className='title'>Draggable</div>
          <div className='menu'>
            <div className='btn makeBoxBtn' style={{width: (isMobile? 90 : 150)+'px'}} onClick={newBoxArr}>Make box</div>
            <div className='btn orderBoxBtn'style={{width: (isMobile? 130 : 150)+'px'}} onClick={orderBoxBtnSwitch}>Arrange boxes</div>
          </div>
        </div>
        {boxList.map((el, idx) => 
        <Box key={idx} mousePos={mousePos} setDrag={setDrag} 
          randomColorList={randomColorList} value={boxList[el]}
          orderBoxBtnOnOff={orderBoxBtnOnOff} setOrderBoxBtnOnOff={setOrderBoxBtnOnOff} 
          zIndexList={zIndexList} setZIndexList={setZIndexList}
          boxDateTimeList={boxDateTimeList}
          draggableArea={draggableArea}
        ></Box>)}
      </Draggable>
  );
}
export default App;


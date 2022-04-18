import React, { useState } from 'react';
import { isMobile } from "react-device-detect";
const Draggable = ({ drag, setDrag, setMousePos,setDraggableArea, children})=> {
  // mouseup outside the box
  const mouseupOutBox = () => {
    setDrag(false)
  }
  
  // mousedown inside the box & mousemove outside the box
  const dragging = (e) => {
    if(drag){
      let mouseX = isMobile ?  e.changedTouches[0].clientX : e.clientX;
      let mouseY = isMobile ?  e.changedTouches[0].clientY : e.clientY;
      setMousePos({x: mouseX, y:mouseY})
    }
  }

  // check window resizing
  window.onresize = (e) => {
    setDraggableArea(document.getElementById('draggableWrapper').getBoundingClientRect());
  }
  return (
    <>
      { isMobile ? 
        <div id='draggableWrapper' className={drag? 'draggableArea pointer' : 'draggableArea'}
        onTouchStart={() => {mouseupOutBox()}} 
        onTouchMove={(e) => {dragging(e)}}
        >{children}</div>
          : 
        <div id='draggableWrapper' className={drag? 'draggableArea pointer' : 'draggableArea'} 
        onMouseUp={() => {mouseupOutBox()}} 
        onMouseMove={(e) => {dragging(e)}}
        >{children}</div>
      }
    </>
  )
}

export default Draggable;
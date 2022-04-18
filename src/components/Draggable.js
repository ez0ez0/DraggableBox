import React, { useState } from 'react';
const Draggable = ({ drag, setDrag, setMousePos,setDraggableArea, children})=> {

  // mouseup outside the box
  const mouseupOutBox = () => {
    setDrag(false)
  }
  
  // mousedown inside the box & mousemove outside the box
  const dragging = (e) => {
    if(drag){
      let mouseX = e.clientX;
      let mouseY = e.clientY;
      setMousePos({x: mouseX, y:mouseY})
    }
  }

  // check window resizing
  window.onresize = (e) => {
    setDraggableArea(document.getElementById('draggableWrapper').getBoundingClientRect());
  }
  return (
    <div id='draggableWrapper' className={drag? 'draggableArea pointer' : 'draggableArea'} 
    onMouseUp={() => {mouseupOutBox()}} 
    onMouseMove={(e) => {dragging(e)}}
    >
      {children}
    </div>
  )
}

export default Draggable;
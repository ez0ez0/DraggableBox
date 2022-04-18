import React, { useState, useEffect } from 'react';
import { ReactComponent as WritingIcon } from '../icon/writing_icon.svg';
import { ReactComponent as CheckIcon } from '../icon/check_icon.svg';

const Draggable = ({ mousePos, setDrag, randomColorList, value, orderBoxBtnOnOff, setOrderBoxBtnOnOff, zIndexList,  setZIndexList, boxDateTimeList, draggableArea})=> {
  // box background color 
  let colorRgb = randomColorList[(value % 5)];
  
  // boxSize
  let boxSize = 200;
  
  // menubar Height
  let menuBarHeight = 60; 

  // box state
  const [boxDragging, setBoxDragging] = useState({
    diffX: 0,
    diffY: 0,
    dragging: false,
    styles: {
      backgroundColor:  colorRgb, 
      zIndex: zIndexList[value],  
      border: `1px solid blue`     
    }
  });
  
  // writing button on/off
  const [writing, setWriting] = useState(false)
  // writing button clickEvent
  const memoBox = (e) => {
    setWriting(!writing);
  }

  // removeBox button clickEvent
  const [hidden, setHidden] = useState(false);
  const removeBox = () => {
    setHidden(true);
  }

  //1-1. onMouseDown inside the box :: setZIndexList
  const getValue = (e) => {
    let idx = Number(e.target.getAttribute('data-value'));
    let len = zIndexList.length;
    let newArr = zIndexList.map(el => {
      if(el < zIndexList[idx]) return el
      if(el > zIndexList[idx]) return el - 1
      if(el === zIndexList[idx]) return len
    });
    setZIndexList(newArr);
  } 

  //1-2. onMouseDown inside the box :: setBoxDragging(dragging: true)
  const dragStart = (e) => {
    setDrag(true);
    setBoxDragging({
      diffX: e.clientX - e.currentTarget.getBoundingClientRect().left,
      diffY: e.clientY - e.currentTarget.getBoundingClientRect().top,
      dragging: true,
      styles: {
        backgroundColor:  colorRgb, 
        left: boxDragging.styles.left,
        top: boxDragging.styles.top,
        zIndex: zIndexList[value]
      }
    })
  } 

  //2. onMouseMove ::  boxDragging.dragging === true => 'Can drag Box' / writing === false => 'Can drag Box'
  const dragging = (e) => {
    if(boxDragging.dragging && !writing){
      let left = (e.clientX - boxDragging.diffX) < 0 ? 0 
        : ((e.clientX - boxDragging.diffX) > window.innerWidth - boxSize ? window.innerWidth - boxSize : e.clientX - boxDragging.diffX );
      let top = (e.clientY - boxDragging.diffY) < 0 ? 0 
        : ((e.clientY - boxDragging.diffY) > window.innerHeight - boxSize ? window.innerHeight - boxSize : e.clientY - boxDragging.diffY);
      setBoxDragging({
        diffX: boxDragging.diffX,
        diffY: boxDragging.diffY,
        dragging: boxDragging.dragging,
        styles: {
          backgroundColor: colorRgb, 
          left: `${left}px`,
          top: `${top}px`,
          zIndex:  zIndexList[value]
        }
      })
    }
  }
  
  //3. onMouseUp inside the box :: setBoxDragging(dragging: false)
  const dragEnd = () => {
    setBoxDragging({
      diffX: boxDragging.diffX,
      diffY: boxDragging.diffY,
      dragging: false,
      styles: {
        backgroundColor:  colorRgb, 
        left: boxDragging.styles.left,
        top:  boxDragging.styles.top,
        zIndex: zIndexList[value]
      }
    })
  }

  /*
  1. zIndexList :: setZIndexList -> setBoxDragging
  2. orderBoxBtnOnOff :: Arrange button Click -> setBoxDragging
  3. hidden :: removeBox button Click -> setBoxDragging
  4. boxDragging :: setBoxDragging -> boxDragging -> setBoxDragging 
  */
  useEffect(() => {
    let ele = document.getElementById(value);
    let eleLeft = ele.getBoundingClientRect().left;
    let eleTop = ele.getBoundingClientRect().top;
    orderBoxBtnOnOff ? setBoxDragging({
      diffX: boxDragging.diffX,
      diffY: boxDragging.diffY,
      dragging: boxDragging.dragging,
      styles: {
        backgroundColor: colorRgb, 
        zIndex: zIndexList[value],
        position: 'relative',
        display: !hidden ? 'inline-block' : 'none' ,
      }
    }) : 
    setBoxDragging({
      diffX: boxDragging.diffX,
      diffY: boxDragging.diffY,
      dragging: boxDragging.dragging,
      styles: {
        backgroundColor:  colorRgb, 
        left: boxDragging.styles.left || eleLeft,
        top: ( boxDragging.styles.top ? ((boxDragging.styles.top+boxSize) > draggableArea.bottom ? (draggableArea.bottom-boxSize):  boxDragging.styles.top) : eleTop ),
        zIndex: zIndexList[value],
        display: !hidden ? 'inline-block' : 'none' ,
      }
    })
    if(orderBoxBtnOnOff) setOrderBoxBtnOnOff(false);
  }, [zIndexList, orderBoxBtnOnOff, hidden, boxDragging]);  

  /*
    << onMouseDown inside the box & onMouseMove outside the box >>
    1. mousePos :: (boxDragging.dragging === true) && (dragging outside the box) -> setBoxDragging
  */
  useEffect(() => {
    const draggingOutBox = (mousePos) => {
    if(boxDragging.dragging && !orderBoxBtnOnOff && !writing){
      //console.log('드래그박스상태', boxDragging.dragging)
        let left = (mousePos['x'] - boxDragging.diffX) < 0 ? 0 
          : ((mousePos['x'] - boxDragging.diffX) > window.innerWidth - boxSize ? window.innerWidth - boxSize : mousePos['x'] - boxDragging.diffX );
        let top = (mousePos.y - boxDragging.diffY) < 0 ? 0 
          : ((mousePos['y'] - boxDragging.diffY) > window.innerHeight - boxSize ? window.innerHeight - boxSize : mousePos['y'] - boxDragging.diffY);
        setBoxDragging({
          diffX: boxDragging.diffX,
          diffY: boxDragging.diffY,
          dragging: boxDragging.dragging,
          styles: {
            backgroundColor: colorRgb, 
            left: `${left}px`,
            top: `${top}px`,
            zIndex:  zIndexList[value]
          }
        })
      }
    }
    draggingOutBox(mousePos);
  }, [mousePos]);  

  /*
    << window resizing >>
    1. draggableArea -> setBoxDragging  :: although resizing window, box doesn't go out of window
  */
  useEffect(() => {
    let ele = document.getElementById(value);
    let eleLeft = ele.getBoundingClientRect().left;
    let eleTop = ele.getBoundingClientRect().top;
    setBoxDragging({
      diffX: boxDragging.diffX,
      diffY: boxDragging.diffY,
      dragging: boxDragging.dragging,
      styles: {
        backgroundColor:  colorRgb, 
        left :  (eleLeft+boxSize) > draggableArea.right ? (draggableArea.right-boxSize > 0 ? draggableArea.right-boxSize : 0 ) : boxDragging.styles.left,
        top : (eleTop+boxSize) > draggableArea.bottom ? (draggableArea.bottom-(boxSize+menuBarHeight) > 0 ? draggableArea.bottom-boxSize : `${menuBarHeight}px` ) : boxDragging.styles.top,
        zIndex: zIndexList[value],
        display: !hidden ? 'inline-block' : 'none' ,
      }
    })
  }, [draggableArea]);  
  
  
  return (
    <div id={value} className={hidden? 'box hidden' : 'box'} 
      style={boxDragging.styles} 
      onMouseDown={(e) => {getValue(e); dragStart(e);}} 
      onMouseMove={(e) => {dragging(e)}} onMouseUp={() => {dragEnd()}} 
      data-value={value}
    >
      <div className='memoBox' onClick={memoBox} data-value={value}>
        {writing ? 
        <CheckIcon className="icon check"  stroke="#00000059" data-value={value}></CheckIcon>
        : <WritingIcon className="icon" stroke="#00000059"  data-value={value}></WritingIcon> } 
      </div>
      <div className = 'removeBox' onClick={removeBox}>×</div>
      <div data-value={value} className = 'makeBoxDate'>{boxDateTimeList[value]}</div>
      <textarea id='memo' data-value={value} placeholder='memo' readOnly={!writing}></textarea>
    </div>
  )
}

export default Draggable;
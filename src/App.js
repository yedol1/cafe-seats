import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";

const drawingBoardSlice = createSlice({
  name: "drawingBoard",
  initialState: { dots: [], lines: [], currentColor: "#000000" },
  reducers: {
    setColor: (state, action) => {
      state.currentColor = action.payload;
    },
    addDot: (state, action) => {
      state.dots.push({ x: action.payload.x, y: action.payload.y, color: state.currentColor });
    },
    addLine: (state, action) => {
      state.lines.push({ start: action.payload.start, end: action.payload.end, color: state.currentColor });
    },
  },
});

const { setColor, addDot, addLine } = drawingBoardSlice.actions;

const store = configureStore({ reducer: drawingBoardSlice.reducer });

function DrawingBoard() {
  const { dots, lines, currentColor } = useSelector((state) => state);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const painting = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const drawDot = (dot) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.fillStyle = dot.color;
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawLine = (line) => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(line.start.x, line.start.y);
    ctx.lineTo(line.end.x, line.end.y);
    ctx.stroke();
  };

  useEffect(() => {
    dots.forEach((dot) => drawDot(dot));
    lines.forEach((line) => drawLine(line));
  }, [dots, lines]);

  const handleMouseDown = (e) => {
    painting.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    dispatch(addDot({ x: e.clientX, y: e.clientY, color: currentColor }));
  };

  const handleMouseUp = () => {
    painting.current = false;
  };

  const handleMouseMove = (e) => {
    if (!painting.current) return;
    const newPosition = { x: e.clientX, y: e.clientY };
    dispatch(addLine({ start: lastPosition.current, end: newPosition, color: currentColor }));
    lastPosition.current = newPosition;
  };

  return (
    <div>
      <canvas ref={canvasRef} width="500" height="500" style={{ border: "1px solid #000000" }} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} />
      <input type="color" value={currentColor} onChange={(e) => dispatch(setColor(e.target.value))} />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <DrawingBoard />
    </Provider>
  );
}

export default App;

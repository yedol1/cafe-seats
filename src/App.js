import React, { useRef, useEffect } from "react";
import { useSelector, useDispatch, Provider } from "react-redux";
import { createSlice, configureStore } from "@reduxjs/toolkit";

const drawingBoardSlice = createSlice({
  name: "drawingBoard",
  initialState: { color: "#000000" },
  reducers: {
    setColor: (state, action) => {
      state.color = action.payload;
    },
  },
});

const { setColor } = drawingBoardSlice.actions;

const store = configureStore({ reducer: drawingBoardSlice.reducer });

function DrawingBoard() {
  const color = useSelector((state) => state.color);
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  let painting = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const startPosition = (e) => {
      painting = true;
      draw(e);
    };

    const finishedPosition = () => {
      painting = false;
      ctx.beginPath();
    };

    const draw = (e) => {
      if (!painting) return;
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;

      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    };

    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    return () => {
      canvas.removeEventListener("mousedown", startPosition);
      canvas.removeEventListener("mouseup", finishedPosition);
      canvas.removeEventListener("mousemove", draw);
    };
  }, [color]);

  return (
    <div>
      <canvas ref={canvasRef} width="500" height="500" style={{ border: "1px solid #000000" }} />
      <input type="color" value={color} onChange={(e) => dispatch(setColor(e.target.value))} />
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

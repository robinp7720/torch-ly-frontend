import {stage, store} from "../../main";
import {getRelativePointerPosition} from "../layerFunctions";
import {blockSnapSize} from "../grid/main";
import {endPen} from "../freeDrawing/main";

let arrow;
let start = {x: 0, y: 0};
let layer;

export function draw(pLayer) {
  layer = pLayer;
}

export function startDraw() {
  endPen();

  stage.on("mousedown", (e) => {
    if (!store.state.manu.measure)
      return;

    lengthSoFar = length();

    lengthSoFar = arrow == null ? 0 : lengthSoFar;

    start = calculateSnapToGrid(getRelativePointerPosition(stage));

    arrow = new Konva.Arrow({
      points: [start.x, start.y, start.x, start.y],
      pointerLength: 20,
      pointerWidth: 20,
      fill: 'black',
      stroke: 'black',
      strokeWidth: 4,
    });
    arrow.currentlyDrawing = true;
    layer.add(arrow);
  })

  stage.on("mousemove", (e) => {
    if (!store.state.manu.measure || arrow == null)
      return;

    length();

    if (arrow.currentlyDrawing)
      arrow.points([start.x, start.y, calculateSnapToGrid(getRelativePointerPosition(stage)).x, calculateSnapToGrid(getRelativePointerPosition(stage)).y])

    layer.batchDraw();
  })

  stage.on("mouseup", (e) => {
    if (e.evt.button === 2)
      return true;

    arrow = null;
    layer.destroyChildren();
    layer.batchDraw();
  })
}

function calculateSnapToGrid(pos) {
  return {
    x: Math.floor(pos.x / blockSnapSize) * blockSnapSize + blockSnapSize / 2,
    y: Math.floor(pos.y / blockSnapSize) * blockSnapSize + blockSnapSize / 2
  };
}

function length() {
  let eins = Math.abs((calculateSnapToGrid(start).x - calculateSnapToGrid(getRelativePointerPosition(stage)).x) / blockSnapSize);
  let zwei = Math.abs((calculateSnapToGrid(start).y - calculateSnapToGrid(getRelativePointerPosition(stage)).y) / blockSnapSize);

  let length = lengthSoFar + Math.max(eins, zwei);
  store.commit("manu/setMeasureLength", length);
  return length;
}

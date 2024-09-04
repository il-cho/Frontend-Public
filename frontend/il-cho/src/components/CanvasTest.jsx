import * as fabric from "fabric";
import { useEffect } from "react";
import ConfettiBall from "../assets/emoji/ConfettiBall.png"; // 이미지 경로를 import
import { getEmoji } from "../util/get-emoji";
import BackgroundImage from "./../assets/cover_1.png"; // 배경 이미지 경로를 import

const CanvasTest = () => {
  let canvas;

  useEffect(() => {
    // Create a wrapper around native canvas element (with id="canvas")
    canvas = new fabric.Canvas("canvas", {
      height: 200,
      width: 300,
    });

  }, []);

  const addImageToCanvas = (emojiId) => {
    const imgElement = new Image();
    imgElement.src = getEmoji(emojiId);
    imgElement.onload = () => {
      const imgInstance = new fabric.Image(imgElement, {
        left: 10,
        top: 10,
        scaleX: 0.5,
        scaleY: 0.5,
        selectable: true,
      });
      canvas.add(imgInstance);
      canvas.renderAll();
    };
  };

  return (
    <>
      <canvas id="canvas" />
      <img
        src={getEmoji(1)}
        id="my-image"
        style={{ cursor: "pointer" }}
        onClick={() => addImageToCanvas(1)}
        alt="Emoji"
      />
      <img
        src={getEmoji(2)}
        id="my-image"
        style={{ cursor: "pointer" }}
        onClick={() => addImageToCanvas(2)}
        alt="Emoji"
      />
      <input className="cover-title" type="text" placeholder="제목 입력" />
    </>
  );
};

export default CanvasTest;

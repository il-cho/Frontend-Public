import "./CoverText.css";
import SemiHeader from "./SemiHeader";
import { getCoverImage } from "../util/get-cover-img";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { getEmoji } from "../util/get-emoji";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import * as fabric from "fabric";
import html2canvas from "html2canvas";
import BackButton from "./Button/BackButton";
import { getRefreshImage } from "../util/get-refresh-icon";
import { getPencilImage } from "../util/get-pencil-icon";
import { getRevmoeButton } from "../util/get-remove-icon";

const CoverText = () => {
  const coverImageId = localStorage.getItem("coverImageId");
  const coverAddedImage = localStorage.getItem("coverAddedImage");
  const [coverTitle, setCoverTitle] = useState(
    localStorage.getItem("coverTitle")
      ? localStorage.getItem("coverTitle")
      : "제목"
  );
  const emojiId = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const nav = useNavigate();
  const nextPage = async () => {
    try {
      //Canvas active 제거
      canvas.discardActiveObject();

      await canvas.renderAll();
      // await new Promise((resolve) => setTimeout(resolve, 100));

      const target = document.getElementById("coverImage");

      if (!target) {
        return alert("표지 저장에 실패했습니다.");
      }

      // if (canvasText.text === "제목") {
      //   canvasText.text = "";
      //   canvas.remove(canvasText);
      //   canvas.renderAll();
      // }
      await html2canvas(target).then((canvas) => {
        const imagelLink = canvas.toDataURL("image/png");
        localStorage.setItem("coverImage", imagelLink);
        localStorage.setItem("coverTitle", canvasText.text);
      });
      localStorage.setItem("lastPage", "/create/text");
      nav("/create/content");
    } catch (error) {
      sessionStorage.setItem("redirection", "/cover/text");
      nav("/error");
    }
  };

  const [titleFont, setTitleFont] = useState("Pretendard");
  const [titleSize, setTitleSize] = useState(40);
  const [titleColor, setTitleColor] = useState("#000000");

  const [canvas, setCanvas] = useState(null);
  const [canvasText, setCanvasText] = useState(null);

  const [selectedObject, setSelectedObject] = useState(null);

  const changeTitleSize = useCallback((e, newValue) => {
    setTitleSize(Number(newValue));
  }, []);

  const changeColor = (e) => {
    setTitleColor(e.target.value);
  };

  useEffect(() => {
    // Create a wrapper around native canvas element (with id="canvas")
    const initCanvas = new fabric.Canvas("canvas", {
      width: 310,
      height: 180,
    });

    const canvasText = new fabric.Textbox(coverTitle, {
      fontFamily: titleFont,
      fontSize: titleSize,
      fill: titleColor,
      left: 50,
      top: 70,
      width: 200,
      editable: true,
      textAlign: "center",
    });
    initCanvas.add(canvasText);
    initCanvas.setActiveObject(canvasText);

    initCanvas.on("selection:created", function (event) {
      const activeObject = event.selected[0];
      if (activeObject && activeObject.type === "image") {
        setSelectedObject(activeObject);
      } else {
        setSelectedObject(null);
      }
    });

    initCanvas.on("selection:updated", function (event) {
      const activeObject = event.selected[0];
      if (activeObject && activeObject.type === "image") {
        setSelectedObject(activeObject);
      } else {
        setSelectedObject(null);
      }
    });

    // Event listener for object movement
    initCanvas.on("object:moving", function (event) {
      const movingObject = event.target;
      updateDeleteButtonPosition(movingObject);
    });

    initCanvas.on("selection:updated", function (event) {
      const activeObject = event.selected[0];
      if (activeObject && activeObject.type === "image") {
        setSelectedObject(activeObject);
      } else {
        setSelectedObject(null);
      }
    });

    initCanvas.on("selection:cleared", function (obj) {
      setSelectedObject(null);
    });

    setCanvasText(canvasText);
    setCanvas(initCanvas);
  }, []);

  // Function to update the delete button's position
  const updateDeleteButtonPosition = (obj) => {
    const deleteButton = document.getElementById("deleteButton");
    if (deleteButton) {
      deleteButton.style.left = `${obj.left + 70}px`;
      deleteButton.style.top = `${obj.top - 20}px`;
    }
  };

  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      canvasText.set({
        fontFamily: titleFont,
        fontSize: titleSize,
        fill: titleColor,
      });
      canvas.renderAll();
    }
  }, [titleSize, titleColor, titleFont]);

  const addEmojiToCanvas = (emojiId) => {
    const imgElement = new Image();
    imgElement.src = getEmoji(emojiId);
    imgElement.onload = () => {
      const imgInstance = new fabric.Image(imgElement, {
        left: 10,
        top: 10,
        scaleX: 0.3,
        scaleY: 0.3,
        selectable: true,
      });
      canvas.add(imgInstance);
      canvas.renderAll();
    };
  };

  const inputTitle = () => {
    canvas.setActiveObject(canvasText);

    canvasText.enterEditing();
  };

  // Handle delete button click
  const handleDelete = () => {
    if (selectedObject && canvas) {
      canvas.remove(selectedObject);
      setSelectedObject(null);
      canvas.renderAll();
    }
  };

  const resetCanvas = () => {
    if (canvas) {
      canvas.clear();
      const canvasText = new fabric.Textbox("제목", {
        fontFamily: "Pretendard",
        fontSize: 40,
        fill: "#000000",
        left: 50,
        top: 70,
        width: 200,
        editable: true,
        textAlign: "center",
      });
      setTitleFont("Pretendard");
      setTitleSize(40);
      setTitleColor("#000000");
      canvas.add(canvasText);

      setCanvasText(canvasText);
    }
  };

  return (
    <div className="CoverText">
      <BackButton onClick={() => nav("/create/image")} />
      <SemiHeader
        title={"초대장 꾸미기"}
        content={"초대장에 들어갈 제목을 입력해주세요."}
      />
      <div className="cover-container" id="coverImage">
        <img
          className="selected-cover rounded-lg max-h-44 min-w-72 shadow"
          src={
            Number(coverImageId) > 4
              ? coverAddedImage
              : getCoverImage(Number(coverImageId))
          }
        />
        <canvas id="canvas" className="rounded-lg" />
        {selectedObject && (
          <img
            id="deleteButton"
            src={getRevmoeButton()}
            className="w-10 h-10"
            style={{
              position: "absolute",
              top: selectedObject.top - 20,
              left: selectedObject.left + 70,
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={handleDelete}
          />
        )}
      </div>
      <div className="float-right">
        <div className="flex justify-end">
          <img
            src={getPencilImage()}
            className="w-4 mb-2 mr-2 cursor-pointer"
            onClick={inputTitle}
          />
          <img
            src={getRefreshImage()}
            className="w-4 mb-2 mr-5 cursor-pointer"
            onClick={resetCanvas}
          />
        </div>
      </div>

      <div className="select-font mt-6">
        <div className="semi-title">글꼴 선택</div>
        <div className="font-buttons">
          <button
            className="font1"
            onClick={() => {
              setTitleFont("Pretendard");
            }}
          >
            프리텐다드
          </button>
          <button
            className="font2"
            onClick={() => {
              setTitleFont("SanTokki");
            }}
          >
            HS산토끼체
          </button>
          <button
            className="font3"
            onClick={() => {
              setTitleFont("DolDam");
            }}
          >
            제주돌담체
          </button>
        </div>
      </div>
      <div className="text-custom mt-6">
        <div className="text-size">
          <div className="semi-title ">글자 크기</div>
          <Box sx={{ width: 200 }}>
            <Slider
              size="small"
              value={titleSize}
              aria-label="Small"
              valueLabelDisplay="auto"
              onChange={changeTitleSize}
            />
          </Box>
        </div>
        <div className="flex flex-col items-center">
          <div className="semi-title">색상</div>
          <input
            className="deco cursor-pointer"
            type="color"
            value={titleColor}
            onChange={changeColor}
          />
        </div>
      </div>
      <div className="flex-row">
        <div className="semi-title">스티커</div>
        <div className="flex flex-wrap justify-center">
          {emojiId.map((item) => (
            <div
              key={item}
              className="emoji-container cursor-pointer my-1 mx-1.5 shadow-inner rounded-lg"
              onClick={() => addEmojiToCanvas(item)}
            >
              <img className="max-w-12" src={getEmoji(item)} />
            </div>
          ))}
        </div>
      </div>
      <div className="float-right my-5 pb-7">
        <Button type={"BLUE"} text={"다음"} onClick={nextPage} />
      </div>
    </div>
  );
};
export default CoverText;

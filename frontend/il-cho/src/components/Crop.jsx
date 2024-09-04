import React, { useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Button from "./Button";

const Crop = ({ file, onCropComplete, onCancel }) => {
  const cropperRef = useRef(null);

  const handleConfirm = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedImageUrl = cropper.getCroppedCanvas().toDataURL();
      onCropComplete(croppedImageUrl); // 자른 이미지를 부모 컴포넌트에 전달
      onCancel();
    }
  };
  const handleCancel = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      onCropComplete(null); // 자른 이미지를 부모 컴포넌트에 전달
      onCancel();
    }
  };

  return (
    <div>
      <Cropper
        src={file}
        style={{ height: 400, width: "99%" }}
        initialAspectRatio={16 / 9} // 초기 비율 설정
        aspectRatio={16 / 9} // 비율을 고정
        guides={false}
        ref={cropperRef}
      />
      <div className="flex justify-center my-2">
        <div>
          <Button type={"BLUE"} text={"확인"} onClick={handleConfirm}></Button>
        </div>
        <div>
          <Button type={"WHITE"} text={"취소"} onClick={handleCancel}></Button>
        </div>
      </div>
    </div>
  );
};

export default Crop;

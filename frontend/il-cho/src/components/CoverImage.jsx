import "./CoverImage.css";
import "./CoverImageSlide.css";
import SemiHeader from "./SemiHeader";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getCoverImage } from "../util/get-cover-img";
import { Swiper, SwiperSlide } from "swiper/react";
import Swal from "sweetalert2";
import BackButton from "./Button/BackButton";
import { Pagination, Mousewheel, EffectCoverflow } from "swiper/modules";
import Modal from "./Modal";
import Crop from "./Crop";
import { Toaster, toast } from "react-hot-toast";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-coverflow";

const CoverImage = () => {
  const [imageList, setImageList] = useState([
    {
      url: getCoverImage(0),
    },
    {
      url: getCoverImage(1),
    },
    {
      url: getCoverImage(2),
    },
    {
      url: getCoverImage(3),
    },
    {
      url: getCoverImage(4),
    },
    {
      url: getCoverImage(5),
    },
    {
      url: getCoverImage(6),
    },
    {
      url: getCoverImage(7),
    },
    {
      url: getCoverImage(8),
    },
    {
      url: getCoverImage(9),
    },
  ]);
  const nav = useNavigate();
  const [selectedCoverId, setSelectedCoverId] = useState(0);
  const [swiper, setSwiper] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [isCrop, setIsCrop] = useState(false);

  const isMounted = useRef();

  const showCustomImage = (event) => {
    base64Encoder(event.target.files[0]);
  };

  const onCancel = () => {
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setImageFile(null);
    setIsModalOpen(false);
  };

  const onCropComplete = (file) => {
    setImageFile(file);
    setIsCrop(true);
  };

  const base64Encoder = (file) => {
    return new Promise((resolve) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);

        // 이미지 조절
        setIsCrop(false);
        setImageFile(e.target.result);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    if (imageFile === null || !isCrop) {
      return;
    }

    const img = new Image();
    img.src = imageFile;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const MAX_WIDTH = 800;
      const scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7); // 0.7은 이미지 품질을 의미

      let nextIdx = imageList.length;
      setImageList([
        ...imageList,
        {
          id: nextIdx,
          url: resizedBase64,
        },
      ]);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    swiper.slideTo(imageList.length - 1);
  }, [imageList]);

  useEffect(() => {
    const pastCoverId = localStorage.getItem("coverImageId");
    if (pastCoverId) {
      setSelectedCoverId(Number(pastCoverId > 9 ? 0 : pastCoverId));
      // setSelectedCoverId(Number(pastCoverId));
    }
  }, []);

  useEffect(() => {
    if (swiper && selectedCoverId !== 0) {
      swiper.slideTo(selectedCoverId);
    }
  }, [swiper, selectedCoverId]);

  const nextPage = () => {
    if (selectedCoverId == 0) {
      // Swal.fire("커버 이미지를 선택해주세요.");
      toast("커버 이미지를 선택해주세요.", {
        icon: "🖼",
        duration: 1500,
      });
      return;
    }
    localStorage.setItem("coverImageId", selectedCoverId);
    localStorage.setItem("coverAddedImage", imageList[selectedCoverId].url);
    localStorage.setItem("lastPage", "/create/image");
    nav("/create/text");
  };

  return (
    <div className="NewCover">
      <BackButton onClick={() => nav("/")} />
      <SemiHeader title={"초대장 표지"} content={"원하는 카드 배경지를 선택하여주세요."} />
      <Toaster
        toastOptions={{
          style: {
            color: "red",
          },
        }}
        containerStyle={{
          top: "45%", // 상단에서 약간 내려오도록 설정
          position: "absolute", // 'absolute'로 위치를 지정하여 카드 위에 배치
          zIndex: 10000, // zIndex를 높여서 카드 위에 위치하게 함
        }}
      />
      <Swiper
        direction={"vertical"}
        effect={"coverflow"}
        centeredSlides={true}
        slidesPerView={2}
        spaceBetween={30}
        initialSlide={selectedCoverId}
        grabCursor={true}
        coverflowEffect={{
          rotate: 20,
          stretch: 50,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        mousewheel={true}
        pagination={true}
        modules={[EffectCoverflow, Pagination, Mousewheel]}
        onSlideChange={(e) => {
          setSelectedCoverId(e.activeIndex);
        }}
        onSwiper={(s) => {
          setSwiper(s);
        }}
      >
        {imageList.map((item, index) =>
          index === 0 ? (
            <SwiperSlide key={index}>
              <input
                type="file"
                name="file"
                className="fileInput"
                id="file"
                accept="image/*"
                onChange={showCustomImage}
              />
              <label
                htmlFor="file"
                className="fileLabel"
                onClick={() => {
                  swiper.slideTo(index);
                }}
              >
                <img src={getCoverImage(0)}></img>
              </label>
            </SwiperSlide>
          ) : (
            <SwiperSlide key={index}>
              <img
                src={item.url}
                onClick={() => {
                  swiper.slideTo(index);
                }}
              />
            </SwiperSlide>
          )
        )}
      </Swiper>

      <div className="button">
        <Button type={"BLUE"} text={"초대장 꾸미기"} onClick={nextPage} />
      </div>
      {/* <div className="mypick">
        <SemiHeader title={"내가 선택한 이미지"} content={"선택 완료 후에 초대장꾸미기 버튼을 눌러주세요"}></SemiHeader>
        {
          (selectedCoverId !== 0) 
          ? <img className="mypick_image" src={imageList[selectedCoverId].url } />
          : undefined
        }

      </div> */}

      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <Crop file={imageFile} onCropComplete={onCropComplete} onCancel={onCancel}></Crop>
      </Modal>
    </div>
  );
};

export default CoverImage;

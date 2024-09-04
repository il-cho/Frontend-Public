import SemiHeader from "./SemiHeader";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "./Button/BackButton";

const CoverContent = () => {
  const coverImage = localStorage.getItem("coverImage");
  const initialCoverContent = localStorage.getItem("coverContent") || "";
  const [coverContent, setCoverContent] = useState(initialCoverContent);
  const [length, setLength] = useState(initialCoverContent.length);
  const [isExceeded, setIsExceeded] = useState(false);

  useEffect(() => {
    document.getElementById("content").value = coverContent;
  }, [coverContent]);

  const nav = useNavigate();
  const nextPage = () => {
    try {
      localStorage.setItem("coverContent", coverContent.trim());
      localStorage.setItem("lastPage", "/create/content");
      nav("/create/preview");
    } catch (error) {
      sessionStorage.setItem("redirection", "/cover/content");
      nav("/error");
    }
  };

  const onTextInsert = (e) => {
    const text = e.target.value;
    if (text.length <= 70) {
      setCoverContent(text);
      setLength(text.length);
      setIsExceeded(false);
    } else {
      setIsExceeded(true);
    }
    // setCoverContent(document.getElementById("content").value);
  };
  return (
    <div>
      <BackButton onClick={() => nav("/create/text")} />
      <SemiHeader
        title="초대장 설명"
        content="초대장에 대한 설명을 작성해주세요."
      />
      <div className="flex flex-col items-center">
        <img className="w-80" src={coverImage} />
        <div className="relative">
          <textarea
            id="content"
            className={`w-80 h-40 p-3 mt-4 resize-none overflow-hidden shadow border-2 border-solid rounded-lg focus:outline-none ${
              isExceeded ? "border-red-500" : "focus:border-blue-400"
            }`}
            placeholder="초대 설명..."
            value={coverContent}
            onChange={onTextInsert}
          />
          <div
            className={`absolute w-72 left-3 ${
              isExceeded ? "text-red-500" : "text-gray-500"
            }`}
          >
            <div className="flex justify-between">
              <div>{length}/70</div>
              {isExceeded ? (
                <div className="text-red-500 text-sm">
                  70자까지 작성 가능합니다.
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-7">
        <Button text="완료" type={"BLUE"} onClick={nextPage} />
      </div>
    </div>
  );
};

export default CoverContent;

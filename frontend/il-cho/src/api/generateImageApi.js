import html2canvas from "html2canvas";
import saveAs from "file-saver";

//div 요소 받아서 화면 캡처
//근데 저장 어떤 방식으로 되는지 확인이 안됨
const handleDownload = async (divRef) => {
    if (!divRef.current) return;

    try {
        const div = divRef.current;
        const canvas = await html2canvas(div, { scale: 2 });
        canvas.toBlob((blob) => {
            if (blob !== null) {
                saveAs(blob, "result.png");
            }
        });
    } catch (error) {
        console.error("Error converting div to image:", error);
    }
};
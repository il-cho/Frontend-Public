import CoverImage from "../components/CoverImage";
import CoverText from "../components/CoverText";
import { Routes, Route } from "react-router-dom";
import CoverContent from "../components/CoverContent";
import CanvasTest from "../components/CanvasTest";
import CoverPreview from "../components/CoverPreview";
import Calendar from "./CalendarPage/CalendarPage";
import Place from "./Place";
import Account from "./Account";
import CreateComplete from "./CreateComplete";
const Cover = () => {
  return (
    <>
      <Routes>
        <Route path="/image" element={<CoverImage />} />
        <Route path="/text" element={<CoverText />} />
        <Route path="/content" element={<CoverContent />} />
        <Route path="/preview" element={<CoverPreview />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/place" element={<Place />} />
        <Route path="/account" element={<Account />} />
        <Route path="/complete" element={<CreateComplete />} />

        {/* <Route path="/canvastest" element={<CanvasTest />} /> */}
      </Routes>
    </>
  );
};

export default Cover;

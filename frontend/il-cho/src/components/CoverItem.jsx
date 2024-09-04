import { getCoverImage } from "../util/get-cover-img";

const CoverItem = ({ coverId }) => {
  return (
      <img
        className="rounded-lg max-h-44 min-w-72"
        src={getCoverImage(Number(coverId))}
      />
  );
};

export default CoverItem;

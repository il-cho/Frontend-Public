import "./SemiHeader.css";

const SemiHeader = ({ title, content, type }) => {
  return (
    <div className={`SemiHeader SemiHeader_${type}`}>
      <div className={`title text-gray-800 title_${type}`}>{title}</div>
      <div className={`content text-gray-500 content_${type}`}>{content}</div>
    </div>
  );
};

export default SemiHeader;

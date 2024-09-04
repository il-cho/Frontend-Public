import { getEmoji } from "../util/get-emoji";

const EmojiItem = ({ emojiId }) => {
  return (
    <div>
      <img src={getEmoji(Number(emojiId))} />
    </div>
  );
};

export default EmojiItem;

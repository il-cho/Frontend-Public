import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import "./FadeAlert.css";

const FadeAlert = ({ alertVisible, text, align }) => {
  const confirmAlert = useRef(null);

  return (
    <CSSTransition
      nodeRef={confirmAlert}
      in={alertVisible}
      timeout={500}
      classNames={`alert-visible-fade`}
      unmountOnExit
    >
      <div className={`confirm-alert confirm-alert-${align}`} ref={confirmAlert}>
        {text}
      </div>
    </CSSTransition>
  );
};

export default FadeAlert;

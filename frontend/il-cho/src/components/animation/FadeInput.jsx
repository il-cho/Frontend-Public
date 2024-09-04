import { CSSTransition } from "react-transition-group";
import "./FadeInput.css";
import { CiSearch } from "react-icons/ci";
import { forwardRef, useEffect, useRef } from "react";

const FadeInput = forwardRef(
  (
    {
      placeholder,
      onKeydown,
      onChange,
      inputValue,
      onClickInputBtn,
      visible,
      onBlur,
      onFocus,
      readonly,
    },
    ref
  ) => {
    const inputWrapperRef = useRef(null);
    return (
      <CSSTransition
        nodeRef={inputWrapperRef}
        in={visible}
        timeout={500}
        classNames="input-visible-fade"
        unmountOnExit
      >
        <div className="input-wrapper" ref={inputWrapperRef}>
          <input
            ref={ref}
            onFocus={onFocus}
            type="text"
            className="Input"
            placeholder={placeholder}
            onKeyDown={onKeydown}
            value={inputValue}
            onChange={onChange}
            onBlur={onBlur}
            readOnly={readonly}
          />
          {onClickInputBtn !== undefined ? (
            <CiSearch className="click-btn" onClick={onClickInputBtn} />
          ) : undefined}
        </div>
      </CSSTransition>
    );
  }
);

FadeInput.displayName = "FadeInput";

export default FadeInput;

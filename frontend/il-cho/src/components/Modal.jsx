import zIndex from "@mui/material/styles/zIndex";
import Button from "./Button";

function Modal({ isOpen, children, closeModal }) {
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div
        style={{
          position: "absolute",
          zIndex: 99,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          zIndex: 100,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          maxWidth: "100%",
          maxHeight: "90%",
          overflowY: "auto",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          borderRadius: "0.4rem",
        }}
      >
        <div>
          <div className="float-right">
            <Button text={"X"} onClick={closeModal} />
          </div>
        </div>
        <div className="flex justify-center">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

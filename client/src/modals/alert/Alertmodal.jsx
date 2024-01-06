import React from "react";
import { Button, Modal } from "react-bootstrap";

const Alertmodal = ({ handleShow, message, setShowAlertModal }) => {
  const handleClose = () => {
    setShowAlertModal(false);
  };
  return (
    <>
      <Modal size="sm" centered show={handleShow} onHide={handleClose}>
        <Modal.Body className="bg-blue rounded-3">
          <center>
            <div className="fs-5 fw-bold text-muted mb-2">{message}</div>
            <Button
              type="button"
              className="bg-blue p-0 py-1 px-4 mt-sm-2 rounded-pill text-primary border-2 border-primary text-primary"
              onClick={handleClose}
            >
              OK
            </Button>
          </center>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Alertmodal;

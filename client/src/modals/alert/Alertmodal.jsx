import React from "react";
import { Button, Modal } from "react-bootstrap";

const Alertmodal = ({ handleShow, message, setShowAlertModal }) => {
  const handleClose = () => {
    setShowAlertModal(false);
  };
  return (
    <>
      <Modal centered show={handleShow} onHide={handleClose}>
        <Modal.Body className="bg-blue rounded-1">
          <center>
            <p className="fs-4 fw-bold text-primary">Alert</p>
            <p className="fs-5 fw-bold text-muted">{message}</p>
            <Button
              type="button"
              className="bg-blue px-3 mt-sm-2 rounded-0 text-primary border-2 border-primary text-primary"
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

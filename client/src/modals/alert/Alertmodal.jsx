import React from "react";
import { Button, Modal } from "react-bootstrap";
import { Check } from "lucide-react";

const Alertmodal = ({ handleShow, message, setShowAlertModal, icon }) => {
  const handleClose = () => {
    setShowAlertModal(false);
  };
  return (
    <>
      <Modal size="sm" centered show={handleShow} onHide={handleClose}>
        <Modal.Body className="bg-blue rounded-2">
          <center className="">
            {icon ? (
              icon
            ) : (
              <Check
                size={50}
                color="var(--blue)"
                style={{ marginBottom: "20px" }}
              />
            )}
            <div className="fs-5 mb-4 text-black">{message}</div>
            <Button
              type="button"
              className="fs-5 p-0 bg-black rounded-3 text-light-blue w-50 border-primary border-2"
              onClick={handleClose}
            >
              Dismiss
            </Button>
          </center>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Alertmodal;

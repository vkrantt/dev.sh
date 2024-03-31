import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Login from "../../components/auth/login/Login";
import Signup from "../../components/auth/signup/Signup";
import Logo from "../../components/logo/Logo";

const LoginModal = ({ handleShow, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Modal show={handleShow} onHide={handleClose}>
        <Modal.Body className="bg-dark">
          <>
            <div className="mb-2">
              <Logo show className="text-light fs-4" />
            </div>
            {isLogin ? (
              <Login handleClose={handleClose} />
            ) : (
              <Signup handleClose={handleClose} />
            )}

            <div className="mt-3">
              <Button
                variant="none"
                className="text-primary"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "don't have any account?"
                  : "Already have an account?"}
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;

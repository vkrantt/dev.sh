import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Logo from "../../components/logo/Logo";
import Login from "../../components/auth/login/Login";
import Signup from "../../components/auth/signup/Signup";

const LoginModal = ({ handleShow, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <>
      <Modal show={handleShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold d-flex text-primary">
            <Logo /> {isLogin ? "Log In" : "Sign up"} to continue
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <>
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
                {isLogin ? "Create account" : "Already have an account ?"}
              </Button>
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;

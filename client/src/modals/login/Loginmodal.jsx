import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Login from "../../components/auth/login/Login";
import Signup from "../../components/auth/signup/Signup";
import Logo from "../../components/logo/Logo";
import { Link } from "react-router-dom";

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

            <div className="mt-3 d-flex justify-content-between align-items-center ">
              <Button
                variant="none"
                className="text-primary mx-0 p-0 m-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin
                  ? "don't have any account?"
                  : "Already have an account?"}
              </Button>

              {isLogin && (
                <div className="">
                  Forgot Password?{" "}
                  <Link onClick={handleClose} to="/forgot-password">
                    Change
                  </Link>
                </div>
              )}
            </div>
          </>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginModal;

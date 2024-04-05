import React from "react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Loader from "../../loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../config/config";
import { AlertCircle } from "lucide-react";
import { handleError } from "../../handlers/ErrorHandler";
import { set } from "../../handlers/storage";

const Login = ({ handleClose }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.password || !credentials.email) {
      setErrorMessage("Please fill all fields");
      return;
    } else {
      setErrorMessage("");
    }

    setErrorMessage("");
    setLoading(true);
    axios
      .post(`${BASE_URL}/users/login`, credentials)
      .then((response) => {
        set("dsh_token", response.data.token);
        setLoading(false);
        handleClose();
        window.location.reload();
      })
      .catch((error) => {
        setErrorMessage(handleError(error));
        setLoading(false);
      });
  };
  return (
    <>
      {errorMessage && (
        <div className="text-danger mb-2 text-center">
          <AlertCircle /> {errorMessage}
        </div>
      )}

      <Form>
        <Form.Group className="mb-2" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            className="bg-black fs-5 border-0 shadow-none login-form-placeholder text-light"
            placeholder="name@example.com"
            type="email"
            name="email"
            onChange={handleChange}
            value={credentials.email}
          />
        </Form.Group>

        <div className="position-relative">
          <Form.Group className="mb-2" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="bg-black fs-5 border-0 shadow-none login-form-placeholder text-light"
              type={show ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={credentials.password}
            />
          </Form.Group>
          <div className="position-absolute top-0 end-0">
            <Button size="sm" variant="dark" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Button
            variant="none"
            className="fs-5 bg-black rounded-3 text-light-blue w-100 border-primary border-2"
            onClick={handleSubmit}
            type="submit"
          >
            {loading ? <Loader /> : "Log In"}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Login;

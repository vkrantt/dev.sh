import React from "react";
import { useState } from "react";
import { Button, FloatingLabel, Form } from "react-bootstrap";
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
      <FloatingLabel
        controlId="floatingInput"
        label="Email address"
        className="mb-3 text-dark"
      >
        <Form.Control
          type="email"
          placeholder="name@example.com"
          className="border-2 rounded-3 shadow-none text-dark"
          name="email"
          onChange={handleChange}
          value={credentials.email}
        />
      </FloatingLabel>
      <div className="position-relative">
        <FloatingLabel
          controlId="floatingPassword"
          label="Password"
          className=" text-dark"
        >
          <Form.Control
            type={show ? "text" : "password"}
            placeholder="Password"
            className="border-2 rounded-3 shadow-none text-dark"
            name="password"
            onChange={handleChange}
            value={credentials.password}
          />
        </FloatingLabel>

        <div className="position-absolute top-0 end-0 mt-3 ">
          <Button size="sm" variant="none" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </Button>
        </div>
      </div>

      <div className="mt-3">
        <Button
          variant="primary"
          className="w-100 bg-blue border-2 rounded-3 text-primary"
          onClick={handleSubmit}
          type="submit"
        >
          {loading ? <Loader /> : "Log In"}
        </Button>
      </div>
    </>
  );
};

export default Login;

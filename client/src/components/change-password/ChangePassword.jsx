import axios from "axios";
import { AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { BASE_URL, toastConfig } from "../../config/config";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../loader/Loader";

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password === "" || form.confirmPassword === "") {
      setErrorMessage("Please all the fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setErrorMessage("");
    setLoading(true);
    axios
      .post(`${BASE_URL}/users/resetpassword/${userId}`, {
        newPassword: form.confirmPassword,
      })
      .then(function (response) {
        if (response.data.status === 404) {
          toast.error(response.data.response, toastConfig);
        } else {
          toast.success(response.data.response, toastConfig);
          setTimeout(() => {
            window.location.pathname = "/";
          }, 3000);
        }
      })
      .catch(function (error) {
        setLoading(false);
        // toast.error(error.error.message, toastConfig);
      });
  };

  return (
    <Container>
      <Toaster />
      <Row className="my-5">
        <Col lg="8" className="m-auto">
          <h1 className="display-4 fw-bold text-light-blue">Change password</h1>
          <h3>Please fill the fields carefully.</h3>
          <Row>
            <Col lg="5" className="m-auto">
              {errorMessage && (
                <div className="text-danger mb-2 text-center">
                  <AlertCircle /> {errorMessage}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-3">
                  <Form.Control
                    className="bg-black fs-5 border-2 shadow-none login-form-placeholder text-light"
                    placeholder="New password"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    value={form.password}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Control
                    className="bg-black fs-5 border-2 shadow-none login-form-placeholder text-light"
                    placeholder="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    onChange={handleChange}
                    value={form.confirmPassword}
                  />
                </Form.Group>
                <div className="mt-3">
                  <Button
                    variant="none"
                    className="w-100 fs-5 bg-black rounded-3 text-light-blue border-primary border-2"
                    type="submit"
                  >
                    {loading ? <Loader /> : "Change Password"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ChangePassword;

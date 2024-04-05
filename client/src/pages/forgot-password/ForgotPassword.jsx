import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { BASE_URL, toastConfig } from "../../config/config";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email === "") setError(false);
  }, [email]);

  const handleChange = (e) => {
    setEmail(e.target.value);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(e.target.value)) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axios
      .post(`${BASE_URL}/users/forgotpassword`, { email })
      .then(function (response) {
        const data = {
          service_id: process.env.REACT_APP_SERVICE_ID,
          template_id: process.env.REACT_APP_TEMPLATE_ID,
          user_id: process.env.REACT_APP_PUBLIC_ID,
          template_params: {
            firstName: response.data.firstName,
            url: response.data.url,
            to_email: response.data.to_email,
          },
        };

        axios({
          method: "post",
          url: "https://api.emailjs.com/api/v1.0/email/send",
          data: data,
        })
          .then((res) => {
            setLoading(false);
            toast.success(
              "Email sent, You can reset your password now.",
              toastConfig
            );
            setEmail("");
          })
          .catch(() => setLoading(false));
      })
      .catch(function (err) {
        if (err && err.response.status === 404) {
          toast.success(err.response.data.response, toastConfig);
        }
        setLoading(false);
      });
  };

  return (
    <Container>
      <Toaster />
      <Row className="my-5">
        <Col lg="8" className="m-auto">
          <h1 className="display-4 fw-bold text-light-blue">Forgot password</h1>
          <h3>Please enter your email which you used to login.</h3>

          <Form.Group className="mt-3" controlId="formBasicEmail">
            <Form.Control
              className={`bg-black fs-5 border-2 shadow-none login-form-placeholder text-light ${
                error ? "border-danger" : ""
              }`}
              placeholder="name@example.com"
              type="email"
              name="email"
              onChange={handleChange}
              value={email}
            />
          </Form.Group>

          <div className="mt-3">
            <Button
              variant="none"
              className="fs-5 bg-black rounded-3 text-light-blue border-primary border-2"
              type="submit"
              onClick={handleSubmit}
              disabled={error || !email}
            >
              {loading ? <Loader /> : "Send Email"}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword;

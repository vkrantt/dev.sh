import React from "react";
import { useRef } from "react";
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import userProfile from "../../../assets/userprofile.png";
import { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import Loader from "../../loader/Loader";
import axios from "axios";
import { BASE_URL } from "../../../config/config";
import { set } from "../../handlers/storage";
import { handleError } from "../../handlers/ErrorHandler";

const Signup = ({ handleClose }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const [show, setShow] = useState(false);
  const [rawImage, setRawImage] = useState(null);
  const [credentials, setCredentials] = useState({
    image: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleImageClick = (e) => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setRawImage(file);
  };

  const handleRemoveImage = () => {
    setRawImage(null);
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  // upload profile picture

  // Create account
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !credentials.password ||
      !credentials.confirmPassword ||
      !credentials.firstName ||
      !credentials.lastName ||
      !credentials.email
    ) {
      setErrorMessage("Please fill all fields");
      return;
    } else {
      setErrorMessage("");
    }

    if (credentials.password !== credentials.confirmPassword) {
      setErrorMessage("Passwords does not matched.");
      return;
    } else {
      setErrorMessage("");
    }

    let formData;
    if (rawImage) {
      setLoading(true);
      const imageFormData = new FormData();
      imageFormData.append("file", rawImage);
      imageFormData.append("upload_preset", "dev.sh");

      const { data } = await axios.post(
        "https://api.cloudinary.com/v1_1/dzychjnog/image/upload",
        imageFormData
      );
      const uploadImageUrl = data?.secure_url;
      formData = {
        image: uploadImageUrl,
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password,
      };
    } else {
      formData = {
        image: "https://api.dicebear.com/avatar.svg",
        firstName: credentials.firstName,
        lastName: credentials.lastName,
        email: credentials.email,
        password: credentials.password,
      };
    }

    setErrorMessage("");
    setLoading(true);
    axios
      .post(`${BASE_URL}/users/create`, formData)
      .then((response) => {
        set("dsh_token", response.data.token);
        setLoading(false);
        window.location.href = "/";
        handleClose();
      })
      .catch((error) => {
        setErrorMessage(handleError(error));
        setLoading(false);
      });
  };

  return (
    <>
      {/* Image */}
      <>
        <div
          onClick={handleImageClick}
          className="d-flex justify-content-center align-itemx-center mb-3 position-relative"
        >
          <img
            src={rawImage ? URL.createObjectURL(rawImage) : userProfile}
            alt=""
            className="rounded-circle border border-3 border-primary"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <input
            type="file"
            ref={inputRef}
            onChange={handleImageChange}
            className="d-none"
          />
        </div>
        {rawImage && (
          <Button
            variant="none "
            size="sm"
            onClick={() => handleRemoveImage()}
            className="position-absolute top-0 start-50 border-primary rounded-circle border-2 mx-3 bg-light p-0 m-0 "
          >
            <X />
          </Button>
        )}
      </>

      {/* Name */}
      {errorMessage && (
        <div className="text-danger mb-2 text-center">
          <AlertCircle /> {errorMessage}
        </div>
      )}

      <Row>
        <Col lg="6">
          <FloatingLabel label="First Name" className="mb-3 text-dark">
            <Form.Control
              type="text"
              placeholder="First Name"
              className="border border-2 shadow-none text-dark"
              name="firstName"
              onChange={handleChange}
              value={credentials.firstName}
            />
          </FloatingLabel>
        </Col>
        <Col lg="6">
          <FloatingLabel label="Last Name" className="mb-3 text-dark">
            <Form.Control
              type="text"
              placeholder="Last Name"
              className="border border-2 shadow-none text-dark"
              name="lastName"
              onChange={handleChange}
              value={credentials.lastName}
            />
          </FloatingLabel>
        </Col>
      </Row>

      {/* Email */}
      <FloatingLabel label="Email address" className="mb-3 text-dark">
        <Form.Control
          type="email"
          placeholder="name@example.com"
          className="border border-2 shadow-none text-dark"
          name="email"
          onChange={handleChange}
          value={credentials.email}
        />
      </FloatingLabel>

      {/* password */}
      <div className="position-relative">
        <FloatingLabel label="Password" className="mb-3 text-dark">
          <Form.Control
            type={show ? "text" : "password"}
            placeholder="Password"
            className="border border-2 shadow-none text-dark"
            name="password"
            onChange={handleChange}
            value={credentials.password}
          />
        </FloatingLabel>

        <FloatingLabel label="Confirm Password" className="mb-3 text-dark">
          <Form.Control
            type={show ? "text" : "password"}
            placeholder="Confirm Password"
            className="border border-2 shadow-none text-dark"
            name="confirmPassword"
            onChange={handleChange}
            value={credentials.confirmPassword}
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
          className="w-100 bg-blue border-2 rounded-2 text-primary"
          type="submit"
          onClick={handleSubmit}
        >
          {loading ? <Loader /> : "Sign In"}
        </Button>
      </div>
    </>
  );
};

export default Signup;

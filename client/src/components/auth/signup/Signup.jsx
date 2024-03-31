import React from "react";
import { useRef } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
// import userProfile from "../../../assets/userprofile.png";
import userProfileDark from "../../../assets/userprofiledark.png";
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
        image: "https://robohash.org/Terry.png?set=set4",
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
      {/* Image */}
      <>
        <div
          onClick={handleImageClick}
          className="d-flex justify-content-center align-itemx-center mb-3 position-relative"
        >
          <img
            src={rawImage ? URL.createObjectURL(rawImage) : userProfileDark}
            alt=""
            className={`rounded-circle border border-3 ${
              rawImage ? "border-success" : "border-primary"
            }`}
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
            variant="dark"
            size="sm"
            onClick={() => handleRemoveImage()}
            className="position-absolute top-0 start-50 mt-4 rounded-pill"
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

      <Form>
        <Row>
          <Col lg="6">
            <Form.Group className="mb-2">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                className="bg-black fs-5 border-0 shadow-none login-form-placeholder text-light"
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={credentials.firstName}
              />
            </Form.Group>
          </Col>
          <Col lg="6">
            <Form.Group className="mb-2">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                className="bg-black fs-5 border-0 shadow-none login-form-placeholder text-light"
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={credentials.lastName}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Email */}
        <Form.Group className="mb-2">
          <Form.Label>Email Adderss</Form.Label>
          <Form.Control
            className="bg-black fs-5 border-0 shadow-none login-form-placeholder text-light"
            type="email"
            placeholder="name@example.com"
            name="email"
            onChange={handleChange}
            value={credentials.email}
          />
        </Form.Group>
        {/* password */}
        <div className="position-relative">
          <Form.Group className="mb-2">
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

          <Form.Group className="mb-2">
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="bg-black fs-5 border-0 shadow-none login-form-placeholder text-light"
              type={show ? "text" : "password"}
              placeholder="Confirm Password"
              name="confirmPassword"
              onChange={handleChange}
              value={credentials.confirmPassword}
            />
          </Form.Group>

          <div className="position-absolute top-0 end-0 ">
            <Button size="sm" variant="dark" onClick={() => setShow(!show)}>
              {show ? "Hide" : "Show"}
            </Button>
          </div>
        </div>
      </Form>

      <div className="mt-3">
        <Button
          variant="none"
          className="fs-5 bg-black rounded-3 text-light-blue w-100 border-primary border-2"
          type="submit"
          onClick={handleSubmit}
        >
          {loading ? <Loader /> : "Create account"}
        </Button>
      </div>
    </>
  );
};

export default Signup;

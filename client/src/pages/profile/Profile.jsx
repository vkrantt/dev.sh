import React, { useRef } from "react";
import { useState } from "react";
import { getUserDetail } from "../../services/user";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import Loader from "../../components/loader/Loader";
import { X } from "lucide-react";
import { get } from "../../components/handlers/storage";
import { Link } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const inputRef = useRef(null);
  const [image, setImage] = useState(null);

  const [follower, setFollower] = useState(0);
  const [following, setFollowing] = useState(0);
  const [posts, setPosts] = useState(0);

  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const loggedInUser = getUserDetail();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    expertise: "",
    existingPassword: "",
    newPassword: "",
    confirmPassword: "",
    city: "",
    state: "",
    // image: "",
    country: "",
    gender: "",
    bio: "",
  });

  const handleImageClick = (e) => {
    inputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/users/getUserById/${loggedInUser.id}`, {
        headers: {
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then(function (response) {
        const data = response.data.response;
        setFollowing(data.following.length);
        setFollower(data.followers.length);
        setPosts(data.postCount);

        setForm({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          expertise: data.expertise,
          city: data.city,
          state: data.state,
          image: data.image,
          country: data.country,
          gender: data.gender,
          bio: data.bio,
        });
        setLoading(false);
      })
      .catch(function (error) {
        setLoading(false);
      });
  }, [loggedInUser.id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // setForm((prevCredentials) => ({
    //   ...prevCredentials,
    //   image: image ? URL.createObjectURL(image) : "",
    // }));

    const formData = form;

    if (!formData.newPassword || formData.newPassword === "") {
      delete formData.newPassword;
    }
    if (!formData.existingPassword || formData.existingPassword === "") {
      delete formData.existingPassword;
    }
    if (!formData.confirmPassword || formData.confirmPassword === "") {
      delete formData.confirmPassword;
    }

    setProfileLoading(true);
    axios
      .post(`${BASE_URL}/users/updateUser/${loggedInUser.id}`, formData, {
        headers: {
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then(function (response) {
        setProfileLoading(false);
      })
      .catch(function (error) {
        setProfileLoading(false);
      });
  };

  const handleDelete = (e) => {
    const consent = window.confirm(
      "Are you sure! Do you really want to delete your account"
    );
    if (consent) {
      axios
        .post(
          `${BASE_URL}/users/deleteUser/${loggedInUser.id}`,
          { isDelete: true },
          {
            headers: {
              Authorization: `Bearer ${get("dsh_token")}`,
            },
          }
        )
        .then(function (response) {
          setLoading(false);
          setTimeout(() => {
            localStorage.removeItem("dsh_token");
            window.location.pathname = "/";
          }, 2000);
        })
        .catch(function (error) {
          setLoading(false);
        });
    }
  };

  return (
    <Container>
      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <h1 className="display-4 fw-bold text-light-blue my-3">Profile</h1>
          {/* Image */}
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <div
                onClick={handleImageClick}
                className=" my-3 position-relative"
                style={{ width: "fit-content" }}
              >
                <img
                  src={image ? URL.createObjectURL(image) : form?.image}
                  alt=""
                  className="rounded-circle border border-3 border-primary"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <input
                  type="file"
                  ref={inputRef}
                  onChange={handleImageChange}
                  className="d-none"
                />
              </div>
              {image && (
                <Button
                  variant="none "
                  size="sm"
                  onClick={() => handleRemoveImage()}
                  className="position-absolute top-0 start-50 border-primary rounded-circle border-2 mx-3 bg-light p-0 m-0 "
                >
                  <X />
                </Button>
              )}
            </div>

            {/* header */}
            <div className="p-3 d-flex align-items-center text-center justify-content-between ">
              <span className="me-3">
                <div className="text-blue">Posts</div>
                <Link to="/view" className="fs-3 profile-links fw-bold">
                  {posts}
                </Link>
              </span>
              <span className="mx-3">
                <div className="text-blue">Followers</div>
                <Link
                  to="/user/followers"
                  className="fs-3 profile-links fw-bold"
                >
                  {follower}
                </Link>
              </span>
              <span className="mx-3">
                <div className="text-blue">Following</div>
                <Link
                  to="/user/following"
                  className="fs-3 profile-links fw-bold"
                >
                  {following}
                </Link>
              </span>
            </div>
            {/* header closed */}
          </div>

          <Form>
            <Row className="mb-3">
              <div className="text-primary">Must details</div>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} lg="4" sm="12">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="First name"
                  type="text"
                  placeholder="Enter first name"
                  name="firstName"
                  onChange={handleChange}
                  value={form.firstName}
                />
              </Form.Group>

              <Form.Group as={Col} lg="4" sm="12">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="Last name"
                  type="text"
                  placeholder="Enter last name"
                  name="lastName"
                  onChange={handleChange}
                  value={form.lastName}
                />
              </Form.Group>

              <Form.Group as={Col} lg="4" sm="12">
                <Form.Label>Gender</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  type="text"
                  name="gender"
                  onChange={handleChange}
                  value={form.gender}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} lg="6" sm="12">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  name="email"
                  onChange={handleChange}
                  value={form.email}
                />
                <Form.Text className="text-secondary">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group as={Col} lg="6" sm="12">
                <Form.Label>Expertise</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="Experts in"
                  type="text"
                  placeholder="Experts in (Must)"
                  name="expertise"
                  onChange={handleChange}
                  value={form.expertise}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <div className="text-primary">Optional</div>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                className="shadow-none border-0 text-light bg-dark rounded-1"
                as="textarea"
                rows={3}
                name="bio"
                onChange={handleChange}
                value={form.bio}
              />
            </Form.Group>

            <Row className="mb-3">
              <Form.Group as={Col} lg="4" md="4" sm="12">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  type="text"
                  name="country"
                  onChange={handleChange}
                  value={form.country}
                />
              </Form.Group>

              <Form.Group as={Col} lg="4" md="4" sm="12">
                <Form.Label>City</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="City"
                  type="text"
                  placeholder="Enter city"
                  name="city"
                  onChange={handleChange}
                  value={form.city}
                />
              </Form.Group>

              <Form.Group as={Col} lg="4" md="4" sm="12">
                <Form.Label>State</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="State"
                  type="text"
                  placeholder="Enter State"
                  name="state"
                  onChange={handleChange}
                  value={form.state}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <div className="text-primary">Change password ?</div>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} lg="6" sm="12">
                <Form.Label>Existing Password</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="Existing password"
                  type="password"
                  placeholder="Enter existing password"
                  name="existingPassword"
                  onChange={handleChange}
                  value={form.existingPassword}
                />
              </Form.Group>

              <Form.Group as={Col} lg="6" sm="12">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  name="newPassword"
                  onChange={handleChange}
                  value={form.newPassword}
                />
              </Form.Group>
              <Form.Group as={Col} lg="6" sm="12">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  className="shadow-none border-0 text-light bg-dark rounded-1"
                  label="Confirm password"
                  type="password"
                  placeholder="Enter password again"
                  name="confirmPassword"
                  onChange={handleChange}
                  value={form.confirmPassword}
                />
              </Form.Group>
            </Row>

            <Button
              variant="primary"
              className=" rounded-1 px-4 text-light mt-4"
              type="submit"
              onClick={handleSubmit}
            >
              {profileLoading ? <Loader variant="light" /> : "Update profile"}
            </Button>
          </Form>

          <Row className="mt-5">
            <hr />
            <div className="mb-3">
              <div className="text-danger">Danger area</div>
            </div>
            <div>
              <p className="text-danger">
                Note: After deleting you cannot recover this account back. Good
                luck!
              </p>
            </div>
            <Col>
              <Button
                variant="none"
                className="bg-danger rounded-1 px-4 text-light"
                type="button"
                onClick={handleDelete}
              >
                {loading ? <Loader /> : "Delete account"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;

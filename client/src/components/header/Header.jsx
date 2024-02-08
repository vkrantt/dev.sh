import React from "react";
import "./Header.css";
import {
  Button,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import Logo from "../logo/Logo";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "../../modals/login/Loginmodal";
import { get, remove } from "../handlers/storage";
import { useState } from "react";
import { getUserDetail } from "../../services/user";
import Avatar from "react-avatar";

const Header = () => {
  const { pathname } = useLocation();
  const [user] = useState(getUserDetail());
  const token = get("dsh_token");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [show, setShow] = useState(false);

  const handleLogout = () => {
    remove("dsh_token");
    window.location.href = "/";
  };

  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  const handleShowLoginModal = () => {
    setShowLoginModal(true);
  };

  return (
    <Container fluid className="top-0 mb-2 bg-dark shadow-custom">
      <Container>
        <Navbar variant="dark" key="lg" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              <Logo show={true} />
            </Navbar.Brand>
            <Navbar.Toggle
              onClick={() => setShow(!show)}
              aria-controls="offcanvasNavbar-expand-lg"
              className="p-0 border-0 shadow-none text-light"
            />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
              show={show}
              className="me-lg-5"
              onHide={() => setShow(!show)}
            >
              <Offcanvas.Header closeButton variant="dark">
                <Offcanvas.Title
                  id="offcanvasNavbarLabel-expand-lg"
                  className="d-flex align-items-center"
                >
                  <Logo show={true} />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="d-flex align-items-center flex-lg-row flex-sm-column justify-content-lg-between">
                <Nav className="d-flex align-items-center justify-content-center flex-lg-grow-1 pe-3">
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/"
                        ? "text-light-blue border-bottom border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => setShow(false)}
                    to="/"
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className={` ${
                      pathname === "/explore"
                        ? "text-light-blue border-bottom border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => setShow(false)}
                    to="/explore"
                  >
                    Explore
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className={` ${
                      pathname === "/trending"
                        ? "text-light-blue border-bottom border-2 border-primary"
                        : ""
                    }`}
                    onClick={() => setShow(false)}
                    to="/trending"
                  >
                    Trending
                  </Nav.Link>
                </Nav>

                <div>
                  {token ? (
                    <NavDropdown
                      menuVariant="dark"
                      drop="down-centered"
                      title={
                        <Avatar
                          round={true}
                          name={user?.firstName}
                          src={user?.image}
                          alt={user?.firstName}
                          size="30"
                          style={{ border: "2px solid #9ec5fe" }}
                        />
                      }
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      {user?.isAdmin || user?.isSuperAdmin ? (
                        <>
                          <NavDropdown.Item
                            as={Link}
                            onClick={() => setShow(false)}
                            to="/write"
                            className={` ${
                              pathname === "/write"
                                ? "text-light border-2 border-bottom border-primary"
                                : ""
                            }`}
                          >
                            Write New
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            onClick={() => setShow(false)}
                            to="/view"
                            className={` ${
                              pathname === "/view"
                                ? "text-light border-2 border-bottom border-primary"
                                : ""
                            }`}
                          >
                            View
                          </NavDropdown.Item>
                        </>
                      ) : null}
                      {user?.isSuperAdmin ? (
                        <>
                          <NavDropdown.Item
                            as={Link}
                            onClick={() => setShow(false)}
                            to="/featured"
                            className={` ${
                              pathname === "/featured"
                                ? "text-light border-2 border-bottom border-primary"
                                : ""
                            }`}
                          >
                            Featured
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            onClick={() => setShow(false)}
                            to="/lists"
                            className={` ${
                              pathname === "/lists"
                                ? "text-light border-2 border-bottom border-primary"
                                : ""
                            }`}
                          >
                            Lists
                          </NavDropdown.Item>
                        </>
                      ) : null}
                      <NavDropdown.Item
                        as={Link}
                        onClick={() => setShow(false)}
                        to="/profile"
                        className={` ${
                          pathname === "/profile"
                            ? "text-light border-2 border-bottom border-primary"
                            : ""
                        }`}
                      >
                        Profile
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        as={Link}
                        onClick={() => setShow(false)}
                        to="/saved"
                        className={` ${
                          pathname === "/saved"
                            ? "text-light border-2 border-bottom border-primary"
                            : ""
                        }`}
                      >
                        Saved
                      </NavDropdown.Item>
                      <NavDropdown.Item onClick={() => handleLogout()}>
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  ) : (
                    <div className="mx-2">
                      <LoginModal
                        handleShow={showLoginModal}
                        handleClose={handleCloseLoginModal}
                      ></LoginModal>
                      <Button
                        variant="primary"
                        size="sm "
                        onClick={handleShowLoginModal}
                        className="bg-blue px-3 mt-lg-0 rounded-1 text-primary border-2 border-primary text-primary"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </div>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </Container>
    </Container>
  );
};

export default Header;

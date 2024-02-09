import React from "react";
import "./Header.css";
import {
  Button,
  Col,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Logo from "../logo/Logo";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "../../modals/login/Loginmodal";
import { get, remove } from "../handlers/storage";
import { useState } from "react";
import { getUserDetail } from "../../services/user";
import Avatar from "react-avatar";
import { Compass, Home, LineChart } from "lucide-react";

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
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="d-none d-lg-flex align-items-center justify-content-center flex-lg-grow-1 pe-3">
                <Nav.Link
                  as={Link}
                  className={`d-flex align-items-center  gap-1 ${
                    pathname === "/"
                      ? "text-light-blue border-bottom border-2 border-primary"
                      : ""
                  }`}
                  to="/"
                >
                  <Home size={18} /> Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  className={`d-flex align-items-center  gap-1  ${
                    pathname === "/explore"
                      ? "text-light-blue border-bottom border-2 border-primary"
                      : ""
                  }`}
                  to="/explore"
                >
                  <Compass size={18} /> Explore
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  className={`d-flex align-items-center  gap-1  ${
                    pathname === "/trending"
                      ? "text-light-blue border-bottom border-2 border-primary"
                      : ""
                  }`}
                  to="/trending"
                >
                  <LineChart size={18} /> Trending
                </Nav.Link>
              </Nav>

              <div className="d-none d-lg-flex me-5">
                {token ? (
                  <NavDropdown
                    menuVariant="dark"
                    drop="start"
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
                      variant="dark"
                      size="sm "
                      onClick={handleShowLoginModal}
                      className="text-light-blue"
                    >
                      Login / Register
                    </Button>
                  </div>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container>
    </Container>
  );
};

export default Header;

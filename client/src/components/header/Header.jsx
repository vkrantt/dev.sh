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
import { Search } from "lucide-react";
import Logo from "../logo/Logo";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "../../modals/login/Loginmodal";
import { get, remove } from "../handlers/storage";
import { useState } from "react";

const Header = () => {
  const { pathname } = useLocation();
  const token = get("dsh_token");
  const [showLoginModal, setShowLoginModal] = useState(false);

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
    <Container fluid className="sticky-top top-0 mb-2 bg-dark">
      <Container>
        <Navbar variant="dark" key="lg" expand="lg" className="bg-dark">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              <Logo />
            </Navbar.Brand>
            <Navbar.Toggle
              aria-controls="offcanvasNavbar-expand-lg"
              className="p-0 border-0 shadow-none"
            />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title
                  id="offcanvasNavbarLabel-expand-lg"
                  className="d-flex align-items-center"
                >
                  <Logo />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className=" d-flex align-items-center justify-content-end flex-grow-1 pe-3">
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/"
                        ? "active border-1 border-bottom border-light"
                        : ""
                    }`}
                    to="/"
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/explore"
                        ? "active border-1 border-bottom border-light"
                        : ""
                    }`}
                    to="/explore"
                  >
                    Explore
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/trending"
                        ? "active border-1 border-bottom border-light"
                        : ""
                    }`}
                    to="/trending"
                  >
                    Trending
                  </Nav.Link>

                  {token ? (
                    <NavDropdown
                      title="More"
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
                      <NavDropdown.Item as={Link} to="/write">
                        Write New
                      </NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/view">
                        View
                      </NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/profile">
                        Profile
                      </NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/featured">
                        Featured
                      </NavDropdown.Item>

                      <NavDropdown.Item as={Link} to="/saved">
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
                        className="bg-blue border-2 px-3 rounded-2 text-primary"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </Nav>
                <Button variant="none" className="p-0 mb-1">
                  <Search size={20} strokeWidth={2} />
                </Button>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </Container>
    </Container>
  );
};

export default Header;

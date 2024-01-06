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
    <Container fluid className="top-0 mb-2 bg-light shadow-custom">
      <Container>
        <Navbar variant="light" key="lg" expand="lg">
          <Container fluid>
            <Navbar.Brand as={Link} to="/">
              <Logo show={true} />
            </Navbar.Brand>
            <Navbar.Toggle
              onClick={() => setShow(!show)}
              aria-controls="offcanvasNavbar-expand-lg"
              className="p-0 border-0 shadow-none"
            />
            <Navbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
              placement="end"
              show={show}
              onHide={() => setShow(!show)}
            >
              <Offcanvas.Header closeButton variant="light">
                <Offcanvas.Title
                  id="offcanvasNavbarLabel-expand-lg"
                  className="d-flex align-items-center"
                >
                  <Logo show={true} />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className=" d-flex align-items-center justify-content-end flex-grow-1 pe-3">
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/"
                        ? "active border-2 border-bottom border-primary text-primary"
                        : ""
                    }`}
                    onClick={() => setShow(false)}
                    to="/"
                  >
                    Home
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/explore"
                        ? "active border-2 border-bottom border-primary text-primary"
                        : ""
                    }`}
                    onClick={() => setShow(false)}
                    to="/explore"
                  >
                    Explore
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    className={`${
                      pathname === "/trending"
                        ? "active border-2 border-bottom border-primary text-primary"
                        : ""
                    }`}
                    onClick={() => setShow(false)}
                    to="/trending"
                  >
                    Trending
                  </Nav.Link>

                  {token ? (
                    <NavDropdown
                      title={
                        <Avatar
                          round={true}
                          name={user?.firstName}
                          src={user?.image}
                          value="86%"
                          size="30"
                          className=""
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
                            className={`${
                              pathname === "/write" ? "active" : ""
                            }`}
                          >
                            Write New
                          </NavDropdown.Item>
                          <NavDropdown.Item
                            as={Link}
                            onClick={() => setShow(false)}
                            to="/view"
                            className={`${
                              pathname === "/view" ? "active" : ""
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
                            className={`${
                              pathname === "/featured" ? "active" : ""
                            }`}
                          >
                            Featured
                          </NavDropdown.Item>
                        </>
                      ) : null}
                      <NavDropdown.Item
                        as={Link}
                        onClick={() => setShow(false)}
                        to="/profile"
                        className={`${pathname === "/profile" ? "active" : ""}`}
                      >
                        Profile
                      </NavDropdown.Item>

                      <NavDropdown.Item
                        as={Link}
                        onClick={() => setShow(false)}
                        to="/saved"
                        className={`${pathname === "/saved" ? "active" : ""}`}
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
                        className="bg-blue px-3 mt-sm-2 rounded-0 text-primary border-2 border-primary text-primary"
                      >
                        Login
                      </Button>
                    </div>
                  )}
                </Nav>
                {/* <Button variant="none" className="p-0 mb-1">
                  <Search size={20} strokeWidth={2} color="var(--blue)" />
                </Button> */}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      </Container>
    </Container>
  );
};

export default Header;

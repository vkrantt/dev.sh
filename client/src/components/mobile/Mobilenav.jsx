import { Compass, Home, LineChart, User } from "lucide-react";
import React, { useState } from "react";
import Avatar from "react-avatar";
import { Button, Col, Container, Nav, NavDropdown, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { get, remove } from "../handlers/storage";
import LoginModal from "../../modals/login/Loginmodal";
import { getUserDetail } from "../../services/user";

const Mobilenav = () => {
  const { pathname } = useLocation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  console.log("-----", pathname);
  const [user] = useState(getUserDetail());
  const token = get("dsh_token");

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
    <div className=" position-fixed bottom-0 bg-none w-100 ">
      <Container className="d-lg-none bg-none">
        <Row>
          <Col lg="6" className="m-auto bg-dark rounded-2">
            <Nav className="justify-content-around">
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  className={`d-flex align-items-center gap-1 ${
                    pathname === "/"
                      ? "text-light-blue border-bottom border-5 border-primary"
                      : "text-light"
                  }`}
                  to="/"
                >
                  <Home size={28} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  className={`d-flex align-items-center  gap-1  ${
                    pathname === "/explore"
                      ? "text-light-blue border-bottom border-5 border-primary"
                      : "text-light"
                  }`}
                  to="/explore"
                >
                  <Compass size={28} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  className={`d-flex align-items-center  gap-1  ${
                    pathname === "/trending"
                      ? "text-light-blue border-bottom border-5 border-primary"
                      : "text-light"
                  }`}
                  to="/trending"
                >
                  <LineChart size={28} />
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <div>
                  {token ? (
                    <NavDropdown
                      menuVariant="dark"
                      drop="up-centered"
                      title={
                        <Avatar
                          round={true}
                          name={user?.firstName}
                          src={user?.image}
                          alt={user?.firstName}
                          size="30"
                        />
                      }
                      id={`offcanvasNavbarDropdown-expand-lg`}
                    >
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
                          <NavDropdown.Item
                            as={Link}
                            to="/view-all-posts"
                            className={` ${
                              pathname === "/view-all-posts"
                                ? "text-light border-2 border-bottom border-primary"
                                : ""
                            }`}
                          >
                            View all posts
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
                        className="text-light-blue mt-1"
                      >
                        <User size={28} />
                      </Button>
                    </div>
                  )}
                </div>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Mobilenav;

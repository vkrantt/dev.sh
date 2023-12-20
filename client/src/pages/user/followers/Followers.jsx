import React from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Usercard from "../../../components/userCard/Usercard";
import { useState } from "react";
import { useEffect } from "react";
import { BASE_URL } from "../../../config/config";
import axios from "axios";
import { get } from "../../../components/handlers/storage";
import Loader from "../../../components/loader/Loader";

const Followers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/users/getFollowers`, {
        headers: {
          "Content-Type": "application/type",
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((data) => {
        setUsers(data.data.response);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <h1 className="display-4 fw-bold text-blue my-3">
            Followers [{users?.length || 0}]
          </h1>

          <Row>
            {loading ? (
              <div className=" my-5">
                <center>
                  <Loader />
                </center>
              </div>
            ) : (
              users.map((user, index) => (
                <Col key={index} lg="4" className="p-2 border-0 border-end">
                  <Usercard showFollowBtn={false} user={user} />
                </Col>
              ))
            )}

            {!loading && users.length === 0 && (
              <Alert variant="primary text-center">
                You don't have any followers
              </Alert>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Followers;

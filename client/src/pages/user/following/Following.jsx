import React from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import Usercard from "../../../components/userCard/Usercard";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config/config";
import { get } from "../../../components/handlers/storage";
import Loader from "../../../components/loader/Loader";

const Following = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/users/getFollowings`, {
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
          <h1 className="display-4 fw-bold text-light-blue my-3">
            Following [{users?.length || 0}]
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
              <Alert
                variant="none"
                className="text-center border-2 border-primary p-1 text-light-blue p-0"
              >
                You don't follow anyone.
              </Alert>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Following;

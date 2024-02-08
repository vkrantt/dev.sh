import React from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { useState } from "react";
import { get } from "../../components/handlers/storage";
import Homecard from "../../components/skeleton/homecard";
import Alertmodal from "../../modals/alert/Alertmodal";

const ViewAll = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post/getPostsByUser`, {
        headers: {
          "Content-Type": "application/type",
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((data) => {
        setPosts(data.data.response);
        setLoading(false);
      });
  }, []);

  const handleDelete = (post) => {
    const confirmation = window.confirm(
      "Are you sure!, This will delete permanently."
    );
    if (confirmation) {
      setIsDeleteLoading(true);
      const filteredNotes = posts.filter((item) => item._id !== post._id);
      setPosts(filteredNotes);
      axios
        .delete(`${BASE_URL}/post/deletePost/${post._id}`, {
          headers: {
            "Content-Type": "application/type",
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        })
        .then((data) => {
          setShowAlertModal(true);
          setAlertMessage(data.data.response);
          setIsDeleteLoading(false);
        });
    }
  };

  return (
    <Container>
      <Row>
        <Col lg="8" className="m-auto">
          {/* Render alert modal */}
          <Alertmodal
            message={alertMessage}
            handleShow={showAlertModal}
            setShowAlertModal={setShowAlertModal}
          ></Alertmodal>

          <h1 className="display-4 fw-bold text-light-blue my-3">
            View [{posts.length || 0}]
          </h1>
          {loading ? (
            <div className=" my-5">
              <Homecard count="5" />
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id}>
                <SocialCard
                  post={post}
                  handleDelete={handleDelete}
                  isDeleteLoading={isDeleteLoading}
                />
              </div>
            ))
          )}

          {!loading && posts.length === 0 && (
            <Alert variant="primary text-center">
              You don't have any posts yet. Please write some post.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewAll;

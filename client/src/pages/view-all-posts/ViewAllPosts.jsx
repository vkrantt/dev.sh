import React from "react";
import { useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";
import Homecard from "../../components/skeleton/homecard";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { get } from "../../components/handlers/storage";
import Alertmodal from "../../modals/alert/Alertmodal";

const ViewAllPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  let [page, setPage] = useState(1);
  const [itemsRequired] = useState(10);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const handleDelete = (post) => {
    const confirmation = window.confirm(
      "Are you sure!, This will delete permanently."
    );
    if (confirmation) {
      setIsDeleteLoading(true);
      //   const filteredNotes = posts.filter((item) => item._id !== post._id);
      //   setPosts(filteredNotes);
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

  useEffect(() => {
    loadPosts();
  }, [page]);

  const loadPosts = () => {
    setLoading(true);
    axios
      .get(
        `${BASE_URL}/post/view-all-posts?page=${page}&pageSize=${itemsRequired}`,
        {
          headers: {
            "Content-Type": "application/type",
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then((response) => {
        setPosts((prev) => [...prev, ...response.data.response.posts]);
        setTotalPostsCount(response.data.response.totalCount);
        setLoading(false);
        setLoading(false);
      });
  };

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  return (
    <Container>
      {/* Render alert modal */}
      <Alertmodal
        message={alertMessage}
        handleShow={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      ></Alertmodal>

      <Row>
        <Col lg="8" className="m-auto">
          {/* Render alert modal */}

          <h1 className="display-4 fw-bold text-light-blue my-3">
            View All Posts [{posts.length || 0}]
          </h1>

          {posts.map((post) => (
            <div key={post._id}>
              <SocialCard
                post={post}
                handleDelete={handleDelete}
                isDeleteLoading={isDeleteLoading}
              />
            </div>
          ))}

          {loading && (
            <div className="">
              <Homecard count="3" />
            </div>
          )}

          <div className="mb-2">
            Showing:
            <b className="mx-2">
              1-{posts.length}/{totalPostsCount}
            </b>
          </div>

          {totalPostsCount !== posts.length && !loading && (
            <div className=" mb-5 d-flex justify-content-center">
              <Button
                variant="none"
                onClick={() => handleLoadMore()}
                className="fs-5 p-0 px-2 bg-black rounded-3 text-light-blue border-primary border-2"
              >
                Show More
              </Button>
            </div>
          )}

          {!loading && posts.length === 0 && (
            <Alert
              variant="none"
              className="text-center border-2 border-primary p-1 text-light-blue p-0"
            >
              You don't have any posts yet. Please write some post.
            </Alert>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ViewAllPosts;

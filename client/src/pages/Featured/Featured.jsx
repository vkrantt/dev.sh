import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../../config/config";
import { Col, Container, Form, Row } from "react-bootstrap";
import Loader from "../../components/loader/Loader";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import Homecard from "../../components/skeleton/homecard";
import { get } from "../../components/handlers/storage";
import Alertmodal from "../../modals/alert/Alertmodal";

const Featured = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (!searchTerm) setPosts([]);
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchPost();
    }
  }, [debouncedSearchTerm]);

  function searchPost() {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post/searchPosts/?query=${debouncedSearchTerm}`, {
        headers: {
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((data) => {
        setPosts(data.data.response);
        setLoading(false);
      });
  }
  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCreateFeatureAccount = (id) => {
    axios
      .post(
        `${BASE_URL}/post/addFeatured/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then(function (response) {
        setFeaturedPosts((prevFeaturedUsers) => [
          ...prevFeaturedUsers,
          response.data.response,
        ]);
        setShowAlertModal(true);
        setAlertMessage("Added to show as featured.");
        setSearchTerm("");
      });
  };

  const handleDelete = ({ _id }) => {
    setFeaturedPosts(featuredPosts.filter((post) => post._id !== _id));
    axios
      .delete(`${BASE_URL}/post/deleteFeatured/${_id}`, {
        headers: {
          Authorization: `Bearer ${get("dsh_token")}`,
        },
      })
      .then((response) => {
        setShowAlertModal(true);
        setAlertMessage("Removed from featured.");
      });
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post/featured`, {
        headers: {
          "Content-Type": "application/type",
        },
      })
      .then((data) => {
        setFeaturedPosts(data.data.response);
        setLoading(false);
      });
  }, []);

  return (
    <Container>
      {/* Render alert modal */}
      <Alertmodal
        message={alertMessage}
        handleShow={showAlertModal}
        setShowAlertModal={setShowAlertModal}
      ></Alertmodal>

      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <span className="">
            <h1 className="display-4 fw-bold text-light-blue my-3">Featured</h1>
          </span>

          <div className="mt-4">
            <Form.Group>
              <Form.Label>Search Post to show as featured</Form.Label>
              <Form.Control
                name="search"
                onChange={handleInputChange}
                value={searchTerm}
                type="text"
                placeholder="Search"
                className="shadow-none border-0 text-light bg-dark rounded-1"
              />
            </Form.Group>

            {searchTerm && (
              <div className="bg-dark text-light border border-secondary rounded-1 border-3 shadow-custom text-light p-2">
                <div className="text-center">
                  {loading && <Loader variant="light" />}
                </div>
                <div>
                  {!loading &&
                    posts?.length > 0 &&
                    posts?.map((post, i) => (
                      <div
                        onClick={() => handleCreateFeatureAccount(post._id)}
                        key={post._id}
                        style={{ cursor: "pointer" }}
                      >
                        <SocialCard featured={true} post={post} />
                        <hr />
                      </div>
                    ))}

                  {!loading && posts?.length <= 0 && (
                    <p className="text-center text-light">No results found</p>
                  )}
                </div>
              </div>
            )}

            {featuredPosts.length > 0 && (
              <div className="my-4">
                <span className="text-primary my-2">
                  <div className="text-decoration-underline">
                    Featured Posts
                  </div>
                </span>
                {featuredPosts?.map((post, i) => (
                  <div key={i} className="my-2 bg-dark">
                    <div className="p-3">
                      <SocialCard post={post} handleDelete={handleDelete} />
                    </div>
                  </div>
                ))}

                {loading && <Homecard count="3" />}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Featured;

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

const Featured = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
        alert("Added");
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
        alert("Removed");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
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
      <Row>
        <Col lg="8" md="12" sm="12" className="m-auto mb-5">
          <span className="text-primary">
            <h1 className="display-4 fw-bold text-primary my-3">Featured</h1>
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
                className="shadow-none border-2 rounded-0"
              />
            </Form.Group>

            {searchTerm && (
              <div className="bg-primary shadow-custom text-light p-2">
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
                        <SocialCard post={post} />
                      </div>
                    ))}

                  {!loading && posts?.length <= 0 && (
                    <p className="text-center">No results found</p>
                  )}
                </div>
              </div>
            )}

            <div className="my-4">
              <span className="text-primary my-2">
                <div className="text-decoration-underline">Featured Posts</div>
              </span>
              {featuredPosts?.map((post, i) => (
                <div key={i} className="my-2 bg-light">
                  <div className="d-flex justify-content-between align-items-center p-3">
                    <SocialCard post={post} handleDelete={handleDelete} />
                  </div>
                </div>
              ))}

              {loading && <Homecard count="3" />}
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Featured;

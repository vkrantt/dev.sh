import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Tags from "../../components/tags/Tags";
import { useLocation } from "react-router-dom";
import { capitalText } from "../../utils/utility";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { useState } from "react";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import Homecard from "../../components/skeleton/homecard";

const Explore = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Get a specific query parameter
  const paramValue = queryParams.get("q");

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  let [page, setPage] = useState(1);
  const [itemsRequired] = useState(10);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const loadPost = () => {
    setLoading(true);
    axios
      .get(
        `${BASE_URL}/post/explore?tags=${paramValue}&page=${page}&pageSize=${itemsRequired}`,
        {
          headers: {
            "Content-Type": "application/type",
          },
        }
      )
      .then((data) => {
        setPosts((prevPosts) => [...prevPosts, ...data.data.response.posts]);
        setTotalPostsCount(data.data.response.totalCount);
        setLoading(false);
      });
  };

  useEffect(() => {
    setPosts([]);
    setPage(1);
    if (paramValue) {
      loadPost();
    }
  }, [paramValue]);

  const handleLoadMore = () => {
    setPage(++page);
    loadPost();
  };

  return (
    <Container>
      <Row className="my-5">
        <Col lg="8" className="m-auto">
          <h1 className="display-4 fw-bold text-blue">Explore</h1>
          <h3>Navigate your way through the guides and tutorials.</h3>

          <div className="my-2">
            <div>
              <>
                <Tags className=" me-2 my-2 " />
              </>
            </div>
          </div>
        </Col>

        {paramValue && (
          <Col lg="8" className="m-auto mt-5">
            <h1 className="display-4 fw-bold text-blue">
              {capitalText(paramValue)}
            </h1>
          </Col>
        )}

        <Col lg="8" className="m-auto mt-5">
          {posts &&
            posts.map((post) => (
              <div key={post._id}>
                <SocialCard post={post} />
              </div>
            ))}

          {loading && <Homecard count="3" />}

          {paramValue && totalPostsCount != posts.length && !loading && (
            <div className=" mb-5 d-flex justify-content-center">
              <Button
                onClick={() => handleLoadMore()}
                className="bg-blue px-3 mt-sm-2 rounded-0 text-primary border-2 border-primary text-primary"
              >
                Show More
              </Button>
            </div>
          )}

          {paramValue && !loading && totalPostsCount === 0 && (
            <div className="text-center">
              <h6 className=" fw-bold">No results found</h6>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Explore;

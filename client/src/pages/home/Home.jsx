import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import SocialCard from "../../components/socialCard.jsx/SocialCard";
import { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { useState } from "react";
import Homecard from "../../components/skeleton/homecard";
import Tags from "../../components/tags/Tags";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  let [page, setPage] = useState(1);
  const [itemsRequired] = useState(10);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const [featured, setFeatured] = useState([]);

  const loadPosts = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post?page=${page}&pageSize=${itemsRequired}`)
      .then((response) => {
        setPosts((prev) => [...prev, ...response.data.response.posts]);
        setTotalPostsCount(response.data.response.totalCount);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadPosts();
  }, [page]);

  const handleLoadMore = () => {
    setPage(page + 1);
  };

  useEffect(() => {
    setFeaturedLoading(true);
    axios
      .get(`${BASE_URL}/post/featured`, {
        headers: {
          "Content-Type": "application/type",
        },
      })
      .then((data) => {
        setFeatured(data.data.response);
        setFeaturedLoading(false);
      });
  }, []);

  return (
    <Container>
      <Row className="d-flex flex-md-row-reverse">
        <Col lg="8" className="order-last">
          <h1 className="display-4 fw-bold text-light-blue">Feed</h1>
          {/* Content for the first column */}

          {posts &&
            posts.map((post) => (
              <div key={post._id}>
                <SocialCard post={post} />
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
        </Col>

        <Col lg="4" className="position-relative order-first">
          {/* Content for the second column */}
          <div className="top-0 end-0 position-sticky pt-3 mb-4">
            <h5 className="text-light">Discover more of what matters to you</h5>
            <>
              <Tags />
            </>

            <div className="mt-3">
              <h4>Featured</h4>
              <>
                {featured &&
                  featured.map((post) => (
                    <div key={post._id}>
                      <SocialCard featured={true} post={post} />
                    </div>
                  ))}

                {featuredLoading && <Homecard count="2" />}
              </>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

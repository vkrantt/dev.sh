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
  let [page, setPage] = useState(1);
  const [itemsRequired] = useState(10);
  const [totalPostsCount, setTotalPostsCount] = useState(0);

  const [featured, setFeatured] = useState([]);

  const loadPosts = () => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post?page=${page}&pageSize=${itemsRequired}`)
      .then((response) => {
        setPosts([...posts, ...response.data.response.posts]);
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
    setPage(++page);
    loadPosts();
  };

  useEffect(() => {
    axios
      .get(`${BASE_URL}/post/featured`, {
        headers: {
          "Content-Type": "application/type",
        },
      })
      .then((data) => {
        setFeatured(data.data.response);
      });
  }, []);

  return (
    <Container>
      <Row className="d-flex flex-md-row-reverse">
        <Col lg="8" className="order-last">
          <h1 className="display-4 fw-bold text-primary my-3">Feed</h1>
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
            <b>
              1-{posts.length}/{totalPostsCount}
            </b>
          </div>

          {totalPostsCount != posts.length && !loading && (
            <div className=" mb-5 d-flex justify-content-center">
              <Button
                onClick={() => handleLoadMore()}
                className="bg-blue px-3 mt-sm-2 rounded-0 text-primary border-2 border-primary text-primary"
              >
                Show More
              </Button>
            </div>
          )}
        </Col>

        <Col lg="4" className="position-relative order-first">
          {/* Content for the second column */}
          <div className="top-0 end-0 position-sticky pt-3">
            <h3 className="fw-bold text-primary">
              Discover more of what matters to you
            </h3>
            <>
              <Tags />
            </>

            <div className=" mt-3 ">
              <h3 className="fw-bold text-primary">Featured</h3>
              <>
                {featured &&
                  featured.map((post) => (
                    <div key={post._id}>
                      <SocialCard featured={true} post={post} />
                    </div>
                  ))}

                {loading && <Homecard count="2" />}
              </>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;

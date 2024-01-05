import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import Loader from "../../components/loader/Loader";
import { formatDate } from "../../utils/utility";
import Usercard from "../../components/userCard/Usercard";
import "./DetailPage.css";
import { Heart, MessageCircle, Bookmark, BookmarkCheck } from "lucide-react";
import { get } from "../../components/handlers/storage";
import { getUserDetail } from "../../services/user";
import LoginModal from "../../modals/login/Loginmodal";

const DetailPage = () => {
  const [loggedInUser] = useState(getUserDetail());
  // If user is not logged in
  const [showLoginModal, setShowLoginModal] = useState(false);

  const params = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [formattedDescription, setFormattedDescription] = useState("");
  let [likeCount, setLikeCount] = useState(0);
  const [isLike, setIsLike] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    comment: "",
    user: {
      image: "",
      createdAt: "",
      firstName: "",
      lastName: "",
    },
  });
  const [commentLoading, setCommentLoading] = useState(false);
  let [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE_URL}/post/getPostDetailsById/${params.id}`, {
        headers: {
          "Content-Type": "application/type",
        },
      })
      .then(function (response) {
        setPost(response.data.response);
        // check if already liked
        setIsLike(response.data.response?.likes?.includes(loggedInUser?.id));
        setLikeCount(response.data.response?.likes?.length);

        // Check if comments already added
        setComments(response.data.response?.comments);
        setCommentCount(response.data.response?.comments?.length);

        // check is post saved bookmark
        setBookmark(
          response.data.response?.bookmarks?.includes(loggedInUser?.id)
        );

        setFormattedDescription(
          response.data.response.description.replace(/\n/g, "<br />")
        );

        setLoading(false);
      })
      .catch(function () {
        setLoading(false);
      });
  }, [params.id]);

  // Handle like section
  const handleLike = (id) => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    setLikeLoading(true);
    axios
      .put(
        `${BASE_URL}/post/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then(function (response) {
        if (response.data.response === "Post unliked") {
          setLikeCount(--likeCount);
        } else {
          setLikeCount(++likeCount);
        }
        setIsLike(!isLike);
        setLikeLoading(false);
      })
      .catch(function () {
        setLikeLoading(false);
      });
  };

  //Handle Comment section
  const handleCommentChange = (e) => {
    const date = new Date();
    setNewComment({
      comment: e.target.value,
      user: {
        image: loggedInUser?.image,
        createdAt: date,
        firstName: loggedInUser?.firstName,
        lastName: loggedInUser?.lastName,
      },
    });
  };

  const handleAddComment = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    if (!newComment.comment || newComment.comment == "") {
      return;
    }
    setCommentLoading(true);
    axios
      .put(
        `${BASE_URL}/post/comment/${params.id}`,
        { comment: newComment.comment },
        {
          headers: {
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then(function (response) {
        setCommentCount(++commentCount);
        setCommentLoading(false);
      })
      .catch(function () {
        setCommentLoading(false);
      });

    if (newComment.comment.trim() !== "") {
      setComments([...comments, newComment]);
      setNewComment({
        comment: "",
        user: {
          image: "",
          createdAt: "",
          firstName: "",
          lastName: "",
        },
      });
    }
  };

  // if user is not logged in
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  // Handle bookmark
  const handleBookmark = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    if (bookmark) {
      axios
        .delete(`${BASE_URL}/post/delete-bookmark/${params.id}`, {
          headers: {
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        })
        .then((response) => {
          alert(response.data.response);
        })
        .catch((error) => {});
    } else {
      axios
        .post(
          `${BASE_URL}/post/save-bookmark/${params.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${get("dsh_token")}`,
            },
          }
        )
        .then((response) => {
          alert(response.data.response);
        })
        .catch((error) => {});
    }
    setBookmark(!bookmark);
  };

  return (
    <Container>
      {/* Render the login modal */}
      <LoginModal
        handleShow={showLoginModal}
        handleClose={handleCloseLoginModal}
      ></LoginModal>
      {/* //////////////////////////// */}

      {loading ? (
        <center>
          <Loader />
        </center>
      ) : (
        <Row>
          <Col lg="8" className="m-auto">
            <div>
              <h1 className="text-blue display-6">{post.title}</h1>
              <p className="text-secondary">
                Created on: <i>{formatDate(post.createdAt)}</i>
              </p>
            </div>

            <Row className="d-flex align-items-center justify-content-between mb-5">
              <Col lg="6">
                <Usercard user={post.createdBy} />
              </Col>
            </Row>

            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center">
                  <Button variant="" className="p-0 m-0">
                    {likeLoading ? (
                      <Spinner variant="danger" size="sm" />
                    ) : isLike ? (
                      <Heart
                        onClick={() => handleLike(post._id)}
                        color="red"
                        style={{ fill: "red" }}
                      />
                    ) : (
                      <Heart onClick={() => handleLike(post._id)} color="red" />
                    )}
                  </Button>

                  <div className="fs-6 mx-2">{likeCount}</div>
                </div>

                <div className="d-flex align-items-center mx-3">
                  <MessageCircle color="var(--blue)" />
                  <div className="fs-6 mx-2">{commentCount}</div>
                </div>
              </div>

              <div className="">
                <Button
                  size="sm"
                  variant="none"
                  className="p-0 m-0"
                  onClick={() => handleBookmark()}
                >
                  {bookmark ? (
                    <BookmarkCheck color="var(--blue)" />
                  ) : (
                    <Bookmark color="var(--blue)" />
                  )}
                </Button>
              </div>
            </div>

            <hr className="text-blue" />
            <Col
              className="fs-4 custom-col-class"
              dangerouslySetInnerHTML={{
                __html: formattedDescription,
              }}
              style={{
                whiteSpace: "pre-line",
              }}
            ></Col>

            {/* Comment section */}
            <hr className="text-blue" />
            <div className="my-5">
              <h4 className="text-primary">Comment Section</h4>
              <ListGroup className="mb-3">
                {comments.map((comment, index) => (
                  <ListGroup.Item
                    className="border-0 border-bottom border-1"
                    key={index}
                  >
                    {/* <strong className="text-blue">
                      {capitalizeName(comment?.user?.firstName)}{" "}
                      {capitalizeName(comment?.user?.lastName)} -{" "}
                    </strong>{" "} */}

                    <Usercard
                      user={comment.user}
                      date={formatDate(comment.createdAt)}
                      showFollowBtn={false}
                    />

                    <div
                      className=" my-3"
                      dangerouslySetInnerHTML={{
                        __html: comment?.comment,
                      }}
                      style={{
                        whiteSpace: "pre-line",
                      }}
                    ></div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form>
                <Form.Group>
                  <Form.Label>Add a Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={12}
                    value={newComment.comment}
                    className=" shadow-none border-2 rounded-0"
                    onChange={handleCommentChange}
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2 shadow-none bg-blue border-2 rounded-0 text-primary"
                  onClick={handleAddComment}
                >
                  {commentLoading ? <Loader /> : "Add Comment"}
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default DetailPage;

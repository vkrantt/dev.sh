import { Bookmark, BookmarkCheck, Edit, Trash } from "lucide-react";
import React, { useState } from "react";
import Avatar from "react-avatar";
import { Button } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  capitalizeName,
  formatDate,
  removeHtmlTagsAndMedia,
  truncateText,
} from "../../utils/utility";
import { getUserDetail } from "../../services/user";
import LoginModal from "../../modals/login/Loginmodal";

const SocialCard = ({ post, handleDelete, isDeleteLoading }) => {
  const [loggedInUser] = useState(getUserDetail());
  // If user is not logged in
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookmark, setBookmark] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleEdit = (note) => {
    navigate({
      pathname: "/write",
      search: `?id=${note._id}`,
    });
  };

  // Handle bookmark
  const handleBookmark = () => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }
    setBookmark(!bookmark);
  };
  // if user is not logged in
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="card border-0 mb-4 bg-dark text-light w-100">
      {/* Render the login modal */}
      <LoginModal
        handleShow={showLoginModal}
        handleClose={handleCloseLoginModal}
      ></LoginModal>
      {/* //////////////////////////// */}
      <div className="row card-body">
        <div className="col-sm-12">
          <div className="card-title d-flex align-items-center">
            <Avatar
              size="20"
              round={true}
              name={post.createdBy.firstName}
              src={post.createdBy.image}
            />
            <div className="mx-2 ">
              <span className="fw-bold">
                {capitalizeName(post.createdBy.firstName)}{" "}
                {capitalizeName(post.createdBy.lastName)}
              </span>{" "}
              in{" "}
              <span className="fw-bold">
                {post.createdBy.expertise ?? "UX design"}{" "}
              </span>
            </div>
          </div>
          <Link to={`/detail/${post._id}`}>
            <h5 className="card-title text-blue">{post.title}</h5>
          </Link>
          <div className="card-text text-secondary">
            {removeHtmlTagsAndMedia(truncateText(post.description))}
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <span>{formatDate(post.createdAt)} </span>{" "}
              {/* <span className="mx-2"> · </span> */}
              {/* <span> 8 min read</span> */}
              <span className="mx-2"> · </span>
              <Button size="sm" className="rounded-2" variant="light">
                {capitalizeName(post.tag)}
              </Button>
              {pathname === "/view" && (
                <div className="d-flex align-items-center">
                  <span className="mx-2"> · </span>
                  <Button variant="dark" size="sm">
                    <div
                      className="d-flex align-items-center border-blue "
                      onClick={() => handleEdit(post)}
                    >
                      <Edit />
                    </div>
                  </Button>
                  <span className="mx-2"> · </span>
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => handleDelete(post)}
                  >
                    <div className="d-flex align-items-center border-blue ">
                      <Trash />
                    </div>
                  </Button>
                </div>
              )}
            </div>

            <Button
              size="sm"
              variant="none"
              className="p-0 m-0"
              onClick={() => handleBookmark()}
            >
              {bookmark ? (
                <BookmarkCheck color="#ffffff" />
              ) : (
                <Bookmark color="#ffffff" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCard;

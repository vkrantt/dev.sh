import { Edit, Trash } from "lucide-react";
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

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleEdit = (note) => {
    navigate({
      pathname: "/write",
      search: `?id=${note._id}`,
    });
  };

  // if user is not logged in
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="card border-0 mb-4 bg-light rounded-0 w-100 shadow-custom">
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
            <h5 className="card-title text-primary">{post.title}</h5>
          </Link>
          <div className="card-text text-secondary">
            {removeHtmlTagsAndMedia(truncateText(post.description))}
          </div>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <span style={{ fontSize: "12px" }}>
                {formatDate(post.createdAt)}{" "}
              </span>{" "}
              <span className="mx-2"> · </span>
              <Button
                size="sm"
                className="border-2 rounded-0"
                variant="outline-primary"
              >
                {capitalizeName(post.tag)}
              </Button>
              {pathname === "/view" && (
                <div className="d-flex align-items-center">
                  <span className="mx-2"> · </span>
                  <Button variant="none" size="sm">
                    <div
                      className="d-flex align-items-center "
                      onClick={() => handleEdit(post)}
                    >
                      <Edit size={15} />
                    </div>
                  </Button>
                  <span className="mx-2"> · </span>
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleDelete(post)}
                  >
                    <div className="d-flex align-items-center ">
                      <Trash size={15} />
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialCard;

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

const SocialCard = ({
  featured,
  post,
  handleDelete,
  isDeleteLoading,
  hideUser,
}) => {
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
    <>
      {post.list && (
        <div className=" w-100">
          <div
            className="card border-0 list-card-color-1 list-card-shadow-2"
            style={{ height: "5px" }}
          ></div>
          <div
            className="card border-0 list-card-color-2  list-card-shadow"
            style={{ height: "5px" }}
          ></div>
        </div>
      )}
      <div
        className={`card text-light mb-3 bg-dark rounded-2 w-100 ${
          featured ? "bg-blue" : "bg-light shadow-custom "
        }`}
      >
        {/* Render the login modal */}
        <LoginModal
          handleShow={showLoginModal}
          handleClose={handleCloseLoginModal}
        ></LoginModal>
        {/* //////////////////////////// */}
        <div className="row card-body">
          <div className="col-sm-12">
            {hideUser ? (
              <></>
            ) : (
              <div className="card-title d-flex align-items-center">
                <Avatar
                  size="20"
                  round={true}
                  name={post.createdBy.firstName}
                  src={post.createdBy.image}
                />
                <div className="mx-2 ">
                  <span className="">
                    {capitalizeName(post.createdBy.firstName)}{" "}
                    {capitalizeName(post.createdBy.lastName)}
                  </span>{" "}
                  {post.createdBy.expertise && (
                    <span className="">
                      in <span>{post.createdBy.expertise}</span>
                    </span>
                  )}
                </div>
              </div>
            )}
            <Link to={`/detail/${post._id}`}>
              <h6
                className={`card-title text-primary ${
                  featured ? "fs-md" : "fs-5"
                }`}
              >
                {post.title}
              </h6>
            </Link>
            {!featured && (
              <div className="card-text text-secondary">
                {removeHtmlTagsAndMedia(truncateText(post.description))}
              </div>
            )}
            <div className="d-flex justify-content-between mt-2">
              <div className="d-flex align-items-center">
                <span style={{ fontSize: "12px" }}>
                  {formatDate(post.createdAt)}{" "}
                </span>{" "}
                <span className="mx-2"> · </span>
                <Button
                  size="sm"
                  className={`rounded-1 text-primary active ${
                    featured ? "fs-sm border-1 p-0 px-1" : "border-0"
                  }`}
                  variant="outline-primary"
                >
                  {capitalizeName(post.tag)}
                </Button>
                {pathname === "/view" && (
                  <div className="d-flex align-items-center">
                    <span className="mx-2"> · </span>
                    <Button variant="none" size="sm">
                      <div
                        className="d-flex align-items-center rounded-1 text-primary active p-2  border-primary border-2 px-3"
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
                      <div className="d-flex align-items-center rounded-1 text-primary active p-2  border-primary border-2 px-3">
                        <Trash size={15} />
                      </div>
                    </Button>
                  </div>
                )}
                {pathname === "/featured" && handleDelete && (
                  <Button
                    variant="none"
                    size="sm"
                    onClick={() => handleDelete(post)}
                  >
                    <div className="d-flex align-items-center rounded-1 text-primary active p-2  border-primary border-2 px-3">
                      <Trash size={15} />
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SocialCard;

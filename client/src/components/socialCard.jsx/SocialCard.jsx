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
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { get } from "../handlers/storage";
import Loader from "../loader/Loader";

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
  const [isApproveLoader, setIsApproveLoader] = useState(false);

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

  const handleApprove = (postId) => {
    setIsApproveLoader(true);
    axios
      .post(
        `${BASE_URL}/post/approve-post/${postId}`,
        {},
        {
          headers: {
            "Content-Type": "application/type",
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then(() => {
        setIsApproveLoader(false);
        alert("Post Approved.");
      });
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
                <div className="mx-2 d-flex">
                  <span className="">
                    {capitalizeName(post.createdBy.firstName)}{" "}
                    {capitalizeName(post.createdBy.lastName)}
                  </span>{" "}
                  {post.createdBy.expertise && (
                    <span className="mx-1">
                      in <span>{post.createdBy.expertise}</span>
                    </span>
                  )}
                  {pathname === "/view-all-posts" &&
                    loggedInUser.isSuperAdmin &&
                    !post.isDeleted &&
                    !post.approved && (
                      <span className="mx-2 d-flex align-items-center">
                        <button
                          onClick={() => handleApprove(post._id)}
                          className="p-0 px-2 bg-black rounded-3 text-light-blue border-primary border-2"
                        >
                          {isApproveLoader ? <Loader /> : "APPROVE"}
                        </button>
                      </span>
                    )}
                </div>
              </div>
            )}
            <Link
              to={`/detail/${post._id}`}
              className="link-offset-2 link-underline link-underline-opacity-0 "
            >
              <h6
                className={`card-title text-light-blue ${
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
                  className={`rounded-1 text-light-blue p-0  ${
                    featured ? "fs-sm border-1" : "border-0"
                  }`}
                  variant="dark"
                >
                  {capitalizeName(post.tag)}
                </Button>
                {post?.list?.name && (
                  <>
                    <span className="mx-2"> · </span>
                    <Button
                      variant="dark"
                      size="sm"
                      className={`rounded-1 p-0`}
                    >
                      {capitalizeName(post?.list?.name)}
                    </Button>
                  </>
                )}
                {(pathname === "/view" || pathname === "/view-all-posts") && (
                  <div className="d-flex align-items-center">
                    <span className="mx-2"> · </span>
                    <Button variant="none" size="sm">
                      <div
                        className="d-flex align-items-center rounded-1 text-light-blue m-0 p-0 "
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
                      <div className="d-flex align-items-center rounded-1 text-light-blue m-0 p-0 ">
                        <Trash size={15} />
                      </div>
                    </Button>
                  </div>
                )}
                {(pathname === "/view-all-posts" || pathname === "/view") && (
                  <div className="d-flex">
                    {post.shared && (
                      <>
                        <span className="mx-2"> · </span>
                        <div className="bg-info px-2 rounded-pill">Shared</div>
                      </>
                    )}
                    {!post.approved && (
                      <>
                        <span className="mx-2"> · </span>
                        <div className="bg-warning px-2 rounded-pill">
                          Pending
                        </div>
                      </>
                    )}
                    {post.approved && (
                      <>
                        <span className="mx-2"> · </span>
                        <div className="bg-success px-2 rounded-pill">
                          Approved
                        </div>
                      </>
                    )}
                    {post.isDeleted && (
                      <>
                        <span className="mx-2"> · </span>
                        <div className="bg-danger px-2 rounded-pill">
                          Deleted
                        </div>
                      </>
                    )}
                  </div>
                )}
                {pathname === "/featured" && handleDelete && (
                  <>
                    <span className="mx-2"> · </span>
                    <Button
                      variant="none"
                      size="sm"
                      onClick={() => handleDelete(post)}
                    >
                      <div className="d-flex p-0 m-0 align-items-center rounded-1 text-light-blue m-0 p-0 ">
                        <Trash size={15} />
                      </div>
                    </Button>
                  </>
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

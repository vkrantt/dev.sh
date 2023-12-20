import React from "react";
import { Button } from "react-bootstrap";
import { capitalizeName } from "../../utils/utility";
import { useState } from "react";
import { getUserDetail } from "../../services/user";
import axios from "axios";
import { BASE_URL } from "../../config/config";
import { get } from "../handlers/storage";
import { useEffect } from "react";
import LoginModal from "../../modals/login/Loginmodal";
import Loader from "../loader/Loader";
import Avatar from "react-avatar";

const Usercard = ({ user, date, showFollowBtn = true }) => {
  const [loggedInUser] = useState(getUserDetail());
  // If user is not logged in
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [follow, setFollow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFollow(user?.followers?.includes(loggedInUser?.id));
  }, []);

  const handleFollow = (id) => {
    if (!loggedInUser) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    axios
      .post(
        `${BASE_URL}/users/subscribe/${id}`,
        { subscribe: follow ? false : true },
        {
          headers: {
            Authorization: `Bearer ${get("dsh_token")}`,
          },
        }
      )
      .then(function (response) {
        setFollow(!follow);
        setLoading(false);
      })
      .catch(function () {
        setLoading(false);
      });
  };

  // if user is not logged in
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  return (
    <div className="d-flex align-items-center">
      {/* Render the login modal */}
      <LoginModal
        handleShow={showLoginModal}
        handleClose={handleCloseLoginModal}
      ></LoginModal>
      {/* //////////////////////////// */}

      <div className="d-flex align-items-center">
        <Avatar
          round={true}
          name={user?.firstName}
          src={user?.image}
          value="86%"
          size="30"
          className="me-3"
        />

        <div>
          <div className="text-blue" style={{ fontSize: "14px" }}>
            <div>
              {capitalizeName(user?.firstName)} {capitalizeName(user?.lastName)}{" "}
              in{" "}
              <span className="fw-bold">
                {user?.expertise ? capitalizeName(user?.expertise) : "Reading"}
              </span>
            </div>
            <div
              className="text-secondary fw-bold"
              style={{ fontSize: "10px" }}
            >
              {date}
            </div>
          </div>
          <div className="text-secondary" style={{ fontSize: "14px" }}></div>
        </div>
      </div>

      {loggedInUser?.id !== user?._id && showFollowBtn && (
        <Button
          size="sm"
          onClick={() => handleFollow(user._id)}
          className="bg-blue rounded-0 px-4 text-primary mx-4"
        >
          {loading ? <Loader /> : follow ? "Following" : "Follow"}
        </Button>
      )}
    </div>
  );
};

export default Usercard;

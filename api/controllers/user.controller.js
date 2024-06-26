import BASE_URL from "../../config.js";
import getToken from "../config/token.js";
import throwError from "../handlers/error.handler.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

// Create New User
export async function createUser(req, res) {
  const { firstName, lastName, email, password, image } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throwError(res, "User already exists.");
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      image,
    });

    const payload = {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      image: newUser.image,
      isAdmin: newUser.isAdmin,
      isSuperAdmin: newUser.isSuperAdmin,
      isDeleted: newUser.isDeleted,
    };

    if (newUser) {
      res.status(200).json({
        status: 200,
        response: "Account created successfully.",
        token: getToken(payload),
      });
    } else {
      throwError(res, "Failed to register user.");
    }
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Login User
export async function loginUser(req, res) {
  const { email, password } = req.body;
  try {
    const query = {
      email: email,
      isDeleted: false,
    };
    const user = await User.findOne(query);
    if (!user) {
      throwError(res, "User not found.");
    }
    const matchUser = await bcrypt.compare(password, user.password);
    if (!matchUser) {
      throwError(res, "User not found.");
    }

    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      isSuperAdmin: user.isSuperAdmin,
      isDeleted: user.isDeleted,
    };

    res.status(200).json({
      status: 200,
      response: "Logged In.",
      token: getToken(payload),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      response: error,
    });
  }
}

// Search User
export async function allUsers(req, res) {
  const keyword = req.query.search
    ? {
        $or: [
          {
            name: { $regex: req.query.search, $options: "i" },
          },
          {
            email: { $regex: req.query.search, $options: "i" },
          },
        ],
        isDeleted: false,
      }
    : {};
  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("_id firstName lastName email image");
  res.json(users);
}

// Subscribe user
export async function subscribeUser(req, res) {
  const loggedInUser = req.user._id;
  const targetUser = req.params.id;
  // const query = {
  //   _id: targetUser,
  //   isDeleted: false,
  // };
  // const user = await User.findOne(query);
  // if (!user) {
  //   throwError(res, "User not found.");
  // }

  try {
    // Check if loggedInUser is already following targetUser
    const isFollowing = await User.findOne({
      _id: loggedInUser,
      following: targetUser,
    }).exec();

    if (isFollowing) {
      // If already following, unfollow by pulling targetUser from loggedInUser's following array
      const unfollowUserA = await User.findByIdAndUpdate(loggedInUser, {
        $pull: { following: targetUser },
      }).exec();

      // Remove loggedInUser from targetUser's followers array
      const unfollowUserB = await User.findByIdAndUpdate(targetUser, {
        $pull: { followers: loggedInUser },
      }).exec();

      res.status(200).json({ status: 200, response: "unfollowed" });
    } else {
      // If not already following, follow as usual
      const followUserA = await User.findByIdAndUpdate(loggedInUser, {
        $addToSet: { following: targetUser },
      }).exec();

      const followUserB = await User.findByIdAndUpdate(targetUser, {
        $addToSet: { followers: loggedInUser },
      }).exec();

      res.status(200).json({ status: 200, response: "followed" });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      response: `Error: ${error.message}`,
    });
  }
}

// Get user by id
export async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const posts = await Post.countDocuments({
      createdBy: id,
      isDeleted: false,
    });

    await User.updateOne({ _id: id }, { $set: { postCount: posts } });
    const user = await User.findById(id).select("-password");

    if (!user) {
      throwError(res, "User not found.");
    }

    res.status(200).json({
      status: "ok",
      response: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// Update user
export async function updateUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      throwError(res, "User not found.");
    }

    await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });
    res.status(200).json({
      status: "ok",
      response: "Profile updated.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// Delete user
export async function deleteUserById(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.json({
        status: 400,
        response: "User Not found.",
      });
    }

    await User.findByIdAndUpdate(id, { $set: { isDeleted: true } });
    res.status(200).json({
      status: "ok",
      response: "Good Bye! Your account has been permanently deleted.",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// Get followers
export async function followers(req, res) {
  try {
    const user = await User.findById(req.user._id).select("followers -_id");

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const ObjectId = mongoose.Types.ObjectId;

    // Assuming followers is an array of strings in your document
    const followerIds = user.followers;

    if (!followerIds || followerIds.length === 0) {
      return res.status(200).json({
        status: "ok",
        response: [], // No followers to fetch
      });
    }

    const newUsers = await Promise.all(
      followerIds.map(async (followerId) => {
        const follower = await User.findById(ObjectId(followerId));

        // You may want to check if follower exists
        if (!follower) {
          return null; // or handle it as needed
        }

        // Only include necessary information in the response
        return {
          _id: follower._id,
          username: follower.username, // Add other properties if needed
        };
      })
    );

    res.status(200).json({
      status: "ok",
      response: newUsers.filter((user) => user !== null), // Filter out null values
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// Get all followers
export async function getAllFollowers(req, res) {
  try {
    // Find the logged-in user and populate the 'following' field to get the actual user objects
    const loggedUser = await User.findById(req.user._id)
      .select("firstName lastName expertise image")
      .populate({
        path: "followers",
        select: "firstName lastName expertise image",
      });

    // Extract the following users
    const followingUsers = loggedUser.followers;

    res.status(200).json({
      status: "ok",
      response: followingUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// Get all followers
export async function getAllFollowings(req, res) {
  try {
    const loggedUser = await User.findById(req.user._id)
      .select("firstName lastName expertise image")
      .populate({
        path: "following",
        select: "firstName lastName expertise image",
      });

    // Extract the following users
    const followingUsers = loggedUser.following;

    res.status(200).json({
      status: "ok",
      response: followingUsers,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// Search User
export async function findUserByEmail(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select("email firstName");
    if (!user) {
      res.status(404).json({
        status: "error",
        response: "User not found",
      });
    } else {
      const url = `${BASE_URL}/change-password?id=${user._id}`;
      res.json({
        status: 200,
        response: "Email sent, You can reset your password now.",
        url,
        firstName: user.firstName,
        to_email: user.email,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error,
    });
  }
}

// reset password
export async function changePassword(req, res) {
  const { id } = req.params;
  const { newPassword } = req.body;
  const user = await User.findOne({ _id: id });
  if (!user) {
    return res.json({
      status: 404,
      response: "User Not found.",
    });
  }

  const hash = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(id, { $set: { password: hash } });

  res.status(200).json({
    status: "ok",
    response: "Password updated successfully.",
  });
}

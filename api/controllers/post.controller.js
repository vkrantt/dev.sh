import Post from "../models/post.model.js";
import User from "../models/user.model.js";

// Create New post
export async function createPost(req, res) {
  const { title, description, tag, shared } = req.body;
  try {
    const post = await Post.create({
      title,
      description,
      tag,
      createdBy: req.user._id,
      shared,
    });

    if (post) {
      res.status(200).json({
        status: 200,
        response: post,
      });
    } else {
      throwError(res, "Failed to create post.");
    }
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Get all posts
export async function allPosts(req, res) {
  try {
    const query = { shared: true, isDeleted: false };
    const posts = await Post.find(query).sort({ createdAt: -1 });
    for (let i = 0; i < posts.length; i++) {
      const item = posts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "-password -links "
      );
    }
    res.status(200).json({
      status: 200,
      response: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Get loggedIn users posts
export async function getLoggedInUsersPosts(req, res) {
  try {
    const query = { createdBy: req.user._id, isDeleted: false };
    const posts = await Post.find(query).sort({ _id: -1 });

    for (let i = 0; i < posts.length; i++) {
      const item = posts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "-password -links "
      );
    }

    res.status(200).json({
      status: 200,
      response: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Get posts by id
export async function getPostById(req, res) {
  const { id } = req.params;
  try {
    const query = { _id: id };
    const post = await Post.findOne(query).populate({
      path: "comments.user",
      select: "firstName lastName image expertise",
    });

    post.createdBy = await User.findById(post.createdBy).select(
      "-password -links"
    );

    res.status(200).json({
      status: 200,
      response: post,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Like post
export async function likePost(req, res) {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).exec();
    const isLiked = post.likes.includes(req.user._id);
    if (isLiked) {
      await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: req.user._id } },
        { new: true }
      ).exec();
      res.status(200).json({
        status: 200,
        response: "Post unliked",
      });
    } else {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
      ).exec();
      if (!updatedPost) {
        return res.status(404).json({
          status: 404,
          response: "Post not found",
        });
      }

      res.status(200).json({
        status: 200,
        response: "Post liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Comment post
export async function commentPost(req, res) {
  const postId = req.params.id;
  const { comment } = req.body;
  try {
    const post = await Post.findById(postId).exec();

    if (!post) {
      return res.status(404).json({
        status: 404,
        response: "Post not found",
      });
    }

    const newComment = {
      user: req.user._id,
      comment,
    };
    post.comments.push(newComment);

    await post.save();

    res.status(200).json({
      status: 200,
      response: "Comment added",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Update post
export async function updatePost(req, res) {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throwError(res, "Post not found.");
    }

    await Post.findByIdAndUpdate(postId, { $set: req.body }, { new: true });
    res.status(200).json({
      status: "ok",
      response: "Post updated.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// delete post
export async function deletePost(req, res) {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throwError(res, "Post not found.");
    }

    await Post.findByIdAndUpdate(
      postId,
      { $set: { isDeleted: true } },
      { new: true }
    );
    res.status(200).json({
      status: "ok",
      response: "Post Deleted.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Trendings
export async function trendings(req, res) {
  try {
    const posts = await Post.find().sort({ likes: -1 }).limit(5);
    for (let i = 0; i < posts.length; i++) {
      const item = posts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "-password -links "
      );
    }
    res.status(200).json({
      status: "ok",
      response: posts,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

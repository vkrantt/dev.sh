import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import List from "../models/list.model.js";

// Create New post
export async function createPost(req, res) {
  const { title, description, tag, shared, list } = req.body;
  try {
    const post = await Post.create({
      title,
      description,
      tag,
      createdBy: req.user._id,
      shared,
      list: list,
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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const query = { approved: true, shared: true, isDeleted: false };

    const [posts, totalCount] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Post.countDocuments(query),
    ]);

    for (let i = 0; i < posts.length; i++) {
      const item = posts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "firstName lastName expertise image"
      );
      item.list = await List.findById(item.list).select("_id name");
    }

    res.status(200).json({
      status: 200,
      response: {
        posts,
        totalCount,
        page,
        pageSize,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// View all posts
export async function viewAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const query = {};

    const [posts, totalCount] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(pageSize),
      Post.countDocuments(query),
    ]);

    for (let i = 0; i < posts.length; i++) {
      const item = posts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "firstName lastName expertise image"
      );
      item.list = await List.findById(item.list).select("_id name");
    }

    res.status(200).json({
      status: 200,
      response: {
        posts,
        totalCount,
        page,
        pageSize,
      },
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
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const query = { createdBy: req.user._id, isDeleted: false };

    const [posts, totalCount] = await Promise.all([
      Post.find(query).sort({ _id: -1 }).skip(skip).limit(pageSize),
      Post.countDocuments(query),
    ]);

    for (let i = 0; i < posts.length; i++) {
      const item = posts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "-password -links "
      );
    }

    res.status(200).json({
      status: 200,
      response: {
        posts,
        totalCount,
        page,
        pageSize,
      },
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
    let post = await Post.findOne(query).populate({
      path: "comments.user",
      select: "firstName lastName image expertise",
    });

    if (post.list) {
      const relatedPosts = await Post.find({
        list: post.list,
        _id: { $ne: post._id },
      });
      post = { ...post.toObject(), relatedPosts };
    }

    post.createdBy = await User.findById(post.createdBy).select(
      "-password -links"
    );
    post.list = await List.findById(post.list).select("_id name");

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
  const { list } = req.body;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throwError(res, "Post not found.");
    }

    if (list === "" || list === undefined) {
      await Post.findByIdAndUpdate(
        postId,
        { $unset: { list: 1 } },
        { new: true }
      );
    }
    req.body.approved = false;
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

// Save bookmark
export async function saveBookmark(req, res) {
  const { postId } = req.params;
  try {
    await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { bookmarks: req.user._id } },
      { new: true }
    );

    res.status(200).json({
      status: "ok",
      response: "Bookmark saved.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// delete bookmarks
export async function deleteBookmark(req, res) {
  const { postId } = req.params;
  try {
    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { bookmarks: req.user._id } },
      { new: true }
    );
    res.status(200).json({
      status: "ok",
      response: "Bookmark removed.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Get all bookmarks
export async function getAllBookmarks(req, res) {
  try {
    const bookmarkedPosts = await Post.find({ bookmarks: req.user._id });

    for (let i = 0; i < bookmarkedPosts.length; i++) {
      const item = bookmarkedPosts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "firstName lastName expertise image"
      );
    }

    res.status(200).json({
      status: "ok",
      response: bookmarkedPosts,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// get all featured post
export async function getAllFeaturedPost(req, res) {
  try {
    const query = { shared: true, isDeleted: false, featured: true };
    const featuredPosts = await Post.find(query);
    for (let i = 0; i < featuredPosts.length; i++) {
      const item = featuredPosts[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "firstName lastName expertise image"
      );
    }

    res.status(200).json({
      status: "ok",
      response: featuredPosts,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// to search post
export async function searchPost(req, res) {
  const { query } = req.query;
  try {
    const searchResults = await Post.find({
      $and: [
        {
          $or: [
            { title: { $regex: query, $options: "i" } }, // Case-insensitive title search
            { description: { $regex: query, $options: "i" } }, // Case-insensitive content search
          ],
        },
        { approved: true, shared: true, isDeleted: false },
      ],
    }).limit(10);
    for (let i = 0; i < searchResults.length; i++) {
      const item = searchResults[i];
      item.createdBy = await User.findById(item.createdBy).select(
        "firstName lastName expertise image"
      );
    }

    res.status(200).json({
      status: "ok",
      response: searchResults,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// add featured post
export async function addFeaturedPost(req, res) {
  const postId = req.params.id;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $set: { featured: true } },
      { new: true } // Return the updated document
    );

    updatedPost.createdBy = await User.findById(updatedPost.createdBy).select(
      "firstName lastName expertise image"
    );
    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json({
      status: "ok",
      response: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// remove featured post
export async function deleteFeaturedPost(req, res) {
  const postId = req.params.id;
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $unset: { featured: 1 } },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

// Filter out the posts
export async function getFilteredPostsByTag(req, res) {
  const { tags } = req.query;
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 1;

  if (!tags) {
    return res.status(400).json({ error: "Tags parameter is required" });
  }

  const tagsArray = tags.split(",");
  try {
    const totalCount = await Post.countDocuments({
      $and: [
        { tag: { $in: tagsArray } },
        { approved: true, shared: true, isDeleted: false },
      ],
    });

    const totalPages = Math.ceil(totalCount / pageSize);
    const currentPage = Math.min(Math.max(1, parseInt(page, 10)), totalPages);

    let filteredPosts;

    if (totalCount > 0) {
      const skip = (currentPage - 1) * pageSize;
      filteredPosts = await Post.find({
        $and: [
          { tag: { $in: tagsArray } },
          { approved: true, shared: true, isDeleted: false },
        ],
      })
        .skip(skip)
        .limit(pageSize);

      if (filteredPosts.length > 0) {
        for (let i = 0; i < filteredPosts.length; i++) {
          const item = filteredPosts[i];
          if (item.createdBy) {
            item.createdBy = await User.findById(item.createdBy).select(
              "firstName lastName expertise image"
            );
          }
        }
      }
    } else {
      filteredPosts = [];
    }

    res.status(200).json({
      status: "ok",
      response: {
        posts: filteredPosts,
        totalCount,
        page,
        pageSize,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

export async function approvePost(req, res) {
  const { id } = req.params;
  try {
    await Post.findByIdAndUpdate(
      id,
      { $set: { approved: true } },
      { new: true }
    );
    res.status(200).json({
      status: "ok",
      response: "Post approved.",
    });
  } catch (error) {
    res.status(500).json({
      status: "Server error",
      response: error,
    });
  }
}

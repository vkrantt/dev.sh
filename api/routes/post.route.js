import express from "express";
import {
  createPost,
  allPosts,
  getLoggedInUsersPosts,
  getPostById,
  likePost,
  commentPost,
  updatePost,
  deletePost,
  trendings,
  saveBookmark,
  deleteBookmark,
  getAllBookmarks,
  getAllFeaturedPost,
  searchPost,
  addFeaturedPost,
  deleteFeaturedPost,
  getFilteredPostsByTag,
  viewAllPosts,
  approvePost,
} from "../controllers/post.controller.js";
import { authguard } from "../middlewares/verifytoken.js";

const router = express.Router();

router.route("/").get(allPosts);
router.route("/create").post(authguard, createPost);
router.route("/like/:id").put(authguard, likePost);
router.route("/comment/:id").put(authguard, commentPost);
router.route("/getPostsByUser").get(authguard, getLoggedInUsersPosts);
router.route("/getPostDetailsById/:id").get(getPostById);
router.route("/updatePost/:id").post(authguard, updatePost);
router.route("/deletePost/:id").delete(authguard, deletePost);
router.route("/trendings").get(trendings);
router.route("/view-all-posts").get(viewAllPosts);
router.route("/approve-post/:id").post(approvePost);

// Bookmarks
router.route("/save-bookmark/:postId").post(authguard, saveBookmark);
router.route("/delete-bookmark/:postId").delete(authguard, deleteBookmark);
router.route("/bookmarks").get(authguard, getAllBookmarks);

// featured
router.route("/featured").get(getAllFeaturedPost);
router.route("/searchPosts").get(searchPost);
router.route("/addFeatured/:id").post(authguard, addFeaturedPost);
router.route("/deleteFeatured/:id").delete(authguard, deleteFeaturedPost);

// explore
router.route("/explore").get(getFilteredPostsByTag);

export default router;

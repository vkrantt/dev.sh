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

export default router;

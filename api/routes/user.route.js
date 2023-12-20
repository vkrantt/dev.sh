import express from "express";
import {
  createUser,
  loginUser,
  subscribeUser,
  allUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  followers,
} from "../controllers/user.controller.js";
import { authguard } from "../middlewares/verifytoken.js";

const router = express.Router();

router.route("/").get(authguard, allUsers);
router.route("/create").post(createUser);
router.route("/login").post(loginUser);
router.route("/subscribe/:id").post(authguard, subscribeUser);
router.route("/getUserById/:id").get(authguard, getUserById);
router.route("/updateUser/:id").post(authguard, updateUserById);
router.route("/deleteUser/:id").delete(authguard, deleteUserById);
router.route("/followers").get(authguard, followers);

export default router;

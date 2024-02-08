import express from "express";

import { authguard } from "../middlewares/verifytoken.js";
import {
  createList,
  deleteList,
  getAllLists,
  updateList,
} from "../controllers/list.controller.js";

const router = express.Router();

router.route("/").get(authguard, getAllLists);
router.route("/create").post(authguard, createList);
router.route("/delete/:id").delete(authguard, deleteList);
router.route("/edit/:id").put(authguard, updateList);

export default router;

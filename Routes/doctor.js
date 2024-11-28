import express from "express";
import {
  updateDoctor,
  deleteDoctor,
  getAllDoctor,
  getSingleDoctor,
  getDoctorProfile,
} from "../Controllers/doctorController.js";

import { authenticate, restrict } from "../auth/verifyToken.js";

import reviewRouter from "./review.js";

const router = express.Router();

// Định tuyến lồng để xử lý các đánh giá liên quan đến bác sĩ
router.use("/:doctorId/reviews", reviewRouter);

// Lấy thông tin chi tiết của một bác sĩ dựa trên ID
router.get("/:id", getSingleDoctor);

// Lấy danh sách tất cả các bác sĩ
router.get("/", getAllDoctor);

// Cập nhật thông tin bác sĩ (yêu cầu quyền bác sĩ).
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);

// Xóa thông tin bác sĩ (yêu cầu quyền bác sĩ)
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);

// Lấy thông tin hồ sơ của bác sĩ hiện tại (yêu cầu quyền bác sĩ)
router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);

export default router;

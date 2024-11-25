import express from "express"; // Import thư viện Express để tạo router
import {
  updateUser,
  deleteUser,
  getAllUser,
  getSingleUser,
  getUserProfile,
  getMyAppointments,
} from "../Controllers/userController.js"; // Import các controller xử lý logic liên quan đến user.

import { authenticate, restrict } from "../auth/verifyToken.js"; // Import middleware xác thực và kiểm tra quyền

const router = express.Router(); // Tạo một router mới của Express

// Route lấy thông tin chi tiết một user dựa trên ID (dành cho "patient")
router.get("/:id", authenticate, restrict(["patient"]), getSingleUser);

// Route lấy danh sách tất cả user (chỉ dành cho "admin")
router.get("/", authenticate, restrict(["admin"]), getAllUser);

// Route cập nhật thông tin user theo ID (dành cho "patient")
router.put("/:id", authenticate, restrict(["patient"]), updateUser);

// Route xóa user theo ID (dành cho "patient")
router.delete("/:id", authenticate, restrict(["patient"]), deleteUser);

router.get("/profile/me", authenticate, restrict(["patient"]), getUserProfile);

router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient"]),
  getMyAppointments
);

export default router; // Xuất router để sử dụng ở file khác

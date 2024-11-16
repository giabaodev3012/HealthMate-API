import express from "express";
import { register, login } from "../Controllers/authController.js";

// Khởi tạo một router mới từ express.Router()
const router = express.Router();

// Định nghĩa route POST cho hành động đăng ký người dùng
// Khi có yêu cầu POST đến đường dẫn '/register', hàm register sẽ được gọi để xử lý
router.post("/register", register);

// Định nghĩa route POST cho hành động đăng nhập người dùng
// Khi có yêu cầu POST đến đường dẫn '/login', hàm login sẽ được gọi để xử lý
router.post("/login", login);

export default router;

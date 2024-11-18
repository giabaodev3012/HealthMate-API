import express from "express"; // Import thư viện Express để tạo router.
import {
  getAllReviews,
  createReview,
} from "../Controllers/reviewController.js"; // Import các hàm xử lý (controller) liên quan đến đánh giá từ file `reviewController.js`.
import { authenticate, restrict } from "../auth/verifyToken.js"; // Import middleware để xác thực và phân quyền người dùng.

const router = express.Router({ mergeParams: true });
// Tạo một router mới với tùy chọn `mergeParams: true` để truy cập tham số từ các router cha.

// Định nghĩa các route cho tài nguyên review.
router
  .route("/") // Định nghĩa route gốc (`/`).
  .get(getAllReviews) // Gọi hàm `getAllReviews` để xử lý yêu cầu GET (lấy tất cả đánh giá).
  .post(authenticate, restrict(["patient"]), createReview);
// Gọi hàm `createReview` để xử lý yêu cầu POST (tạo đánh giá mới).
// Trước khi tạo đánh giá:
// - Middleware `authenticate`: Xác thực người dùng (kiểm tra token hợp lệ).
// - Middleware `restrict`: Chỉ cho phép người dùng có vai trò "patient" thực hiện hành động này.

export default router;
// Xuất router này để có thể sử dụng trong các file khác

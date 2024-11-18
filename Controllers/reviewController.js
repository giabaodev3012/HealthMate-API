import Review from "../models/ReviewSchema.js"; // Import model Review để thao tác với dữ liệu đánh giá trong cơ sở dữ liệu.
import Doctor from "../models/DoctorSchema.js"; // Import model Doctor để thao tác với dữ liệu bác sĩ trong cơ sở dữ liệu.

// Lấy danh sách tất cả đánh giá
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}); // Lấy toàn bộ dữ liệu đánh giá từ cơ sở dữ liệu.
    res.status(200); // Thiết lập mã trạng thái HTTP là 200 (Thành công).
    json({ success: true, message: "Successful", data: reviews }); // Gửi phản hồi với thông báo thành công và dữ liệu đánh giá.
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" }); // Gửi phản hồi lỗi nếu xảy ra ngoại lệ.
  }
};

// Tạo mới một đánh giá
export const createReview = async (req, res) => {
  // Nếu không có ID bác sĩ trong body, lấy ID từ tham số trong URL.
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;

  // Nếu không có ID người dùng trong body, lấy ID từ thông tin người dùng đã xác thực.
  if (!req.body.user) req.body.user = req.userId;

  const newReview = new Review(req.body); // Tạo một đánh giá mới với dữ liệu từ body của yêu cầu.

  try {
    const savedReview = await newReview.save(); // Lưu đánh giá vào cơ sở dữ liệu.

    // Thêm ID của đánh giá vừa tạo vào danh sách đánh giá của bác sĩ.
    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id },
    });

    // Phản hồi với thông báo thành công và dữ liệu đánh giá vừa lưu.
    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Phản hồi lỗi nếu xảy ra vấn đề khi lưu hoặc cập nhật.
  }
};

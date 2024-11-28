import Review from "../models/ReviewSchema.js"; // Import model Review để thao tác với dữ liệu đánh giá trong cơ sở dữ liệu.
import Doctor from "../models/DoctorSchema.js"; // Import model Doctor để thao tác với dữ liệu bác sĩ trong cơ sở dữ liệu.

// Hàm lấy danh sách tất cả đánh giá
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}); // Truy vấn để lấy toàn bộ dữ liệu đánh giá từ cơ sở dữ liệu.
    res.status(200); // Thiết lập mã trạng thái HTTP là 200 (thành công).
    json({ success: true, message: "Successful", data: reviews }); // Gửi phản hồi với thông báo thành công và danh sách dữ liệu đánh giá.
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" }); // Gửi phản hồi lỗi với mã trạng thái 404 nếu có ngoại lệ.
  }
};

// Hàm tạo mới một đánh giá
export const createReview = async (req, res) => {
  // Nếu không có ID bác sĩ trong body request, lấy ID từ tham số trong URL.
  if (!req.body.doctor) req.body.doctor = req.params.doctorId;

  // Nếu không có ID người dùng trong body request, lấy ID từ thông tin người dùng đã đăng nhập.
  if (!req.body.user) req.body.user = req.userId;

  const newReview = new Review(req.body); // Tạo một đối tượng Review mới với dữ liệu từ body request.

  try {
    const savedReview = await newReview.save(); // Lưu đánh giá mới vào cơ sở dữ liệu.

    // Cập nhật thông tin bác sĩ: thêm ID đánh giá vừa lưu vào danh sách đánh giá của bác sĩ.
    await Doctor.findByIdAndUpdate(req.body.doctor, {
      $push: { reviews: savedReview._id }, // Dùng $push để thêm ID đánh giá vào mảng reviews.
    });

    // Phản hồi thành công với dữ liệu đánh giá vừa tạo.
    res
      .status(200)
      .json({ success: true, message: "Review submitted", data: savedReview });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message }); // Gửi phản hồi lỗi nếu có vấn đề trong quá trình lưu hoặc cập nhật.
  }
};

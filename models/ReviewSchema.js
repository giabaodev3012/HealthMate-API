import mongoose from "mongoose";
import Doctor from "./DoctorSchema.js";

const reviewSchema = new mongoose.Schema(
  {
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware "pre" cho các query `find` để populate thông tin người dùng (user) khi truy vấn các đánh giá.
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user", // Tham chiếu tới trường `user` để lấy thông tin người dùng.
    select: "name photo", // Chỉ lấy các trường `name` và `photo` của người dùng.
  });

  next(); // Tiến hành tiếp tục query.
});

// Thêm một phương thức static vào schema để tính toán trung bình đánh giá của bác sĩ.
reviewSchema.statics.calcAverageRatings = async function (doctorId) {
  // `this` trỏ tới model `Review`.
  const stats = await this.aggregate([
    {
      $match: { doctor: doctorId }, // Lọc các đánh giá cho bác sĩ có `doctorId`.
    },
    {
      $group: {
        _id: "$doctor", // Nhóm các đánh giá theo bác sĩ.
        numOfRating: { $sum: 1 }, // Tính tổng số lượng đánh giá.
        avgRating: { $avg: "$rating" }, // Tính điểm trung bình của các đánh giá.
      },
    },
  ]);

  // Cập nhật thông tin trung bình và tổng số đánh giá cho bác sĩ trong collection `Doctor`.
  await Doctor.findByIdAndUpdate(doctorId, {
    totalRating: stats[0].numOfRating, // Số lượng đánh giá.
    averageRating: stats[0].avgRating, // Điểm trung bình của các đánh giá.
  });
};

// Middleware "post" được gọi sau khi lưu thành công một đánh giá.
// Tự động tính toán và cập nhật thông tin đánh giá của bác sĩ sau khi có đánh giá mới.
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.doctor); // Gọi phương thức static `calcAverageRatings` để tính toán lại đánh giá của bác sĩ.
});

export default mongoose.model("Review", reviewSchema); // Xuất model `Review` từ schema này để sử dụng trong các phần khác của ứng dụng.

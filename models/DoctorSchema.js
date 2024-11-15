import mongoose from "mongoose";
// Import thư viện Mongoose để làm việc với MongoDB

// Định nghĩa schema cho collection Doctor
const DoctorSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  // Email của bác sĩ, bắt buộc (required), không được trùng lặp (unique)

  password: { type: String, required: true },
  // Mật khẩu của bác sĩ, bắt buộc

  name: { type: String, required: true },
  // Tên của bác sĩ, bắt buộc

  phone: { type: Number },
  // Số điện thoại, không bắt buộc

  photo: { type: String },
  // URL ảnh đại diện của bác sĩ, không bắt buộc

  ticketPrice: { type: Number },
  // Giá vé khám, không bắt buộc

  role: { type: String },
  // Vai trò của người dùng (ví dụ: "doctor", "admin"), không bắt buộc

  // Các trường chỉ dành riêng cho bác sĩ
  specialization: { type: String },
  // Chuyên môn của bác sĩ (ví dụ: "Cardiologist", "Dentist")

  qualifications: { type: Array },
  // Danh sách các chứng chỉ của bác sĩ (ví dụ: ["MBBS", "MD"])

  experiences: { type: Array },
  // Danh sách kinh nghiệm làm việc (ví dụ: ["5 years at ABC Hospital"])

  bio: { type: String, maxLength: 50 },
  // Tiểu sử ngắn của bác sĩ, tối đa 50 ký tự

  about: { type: String },
  // Mô tả chi tiết hơn về bác sĩ, không bắt buộc

  timeSlots: { type: Array },
  // Mảng chứa các khung giờ làm việc của bác sĩ

  reviews: [{ type: mongoose.Types.ObjectId, ref: "Review" }],
  // Mảng ID các đánh giá, tham chiếu đến collection "Review"

  averageRating: { type: Number, default: 0 },
  // Điểm đánh giá trung bình của bác sĩ, mặc định là 0

  totalRating: { type: Number, default: 0 },
  // Tổng số đánh giá của bác sĩ, mặc định là 0

  isApproved: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending",
  },
  // Trạng thái phê duyệt của bác sĩ, chỉ nhận giá trị trong ["pending", "approved", "cancelled"]
  // Mặc định là "pending"

  appointments: [{ type: mongoose.Types.ObjectId, ref: "Appointment" }],
  // Mảng ID các lịch hẹn, tham chiếu đến collection "Appointment"
});

// Tạo mô hình (model) từ schema và export
export default mongoose.model("Doctor", DoctorSchema);
// Mô hình "Doctor" sẽ dùng để thao tác với collection "doctors" trong MongoDB

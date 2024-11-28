// Import mô hình User từ file UserSchema.js để tương tác với dữ liệu trong MongoDB.
import User from "../models/UserSchema.js"; // Model cho thông tin người dùng.
import Booking from "../models/BookingSchema.js"; // Model cho thông tin đặt lịch.
import Doctor from "../models/DoctorSchema.js"; // Model cho thông tin bác sĩ.

// Hàm cập nhật thông tin người dùng theo ID.
export const updateUser = async (req, res) => {
  const id = req.params.id; // Lấy ID từ URL parameters.

  try {
    // Tìm và cập nhật người dùng theo ID, sử dụng dữ liệu từ body request.
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body }, // Cập nhật các trường từ dữ liệu trong body request.
      { new: true } // Trả về dữ liệu sau khi cập nhật.
    );

    // Phản hồi khi cập nhật thành công.
    res.status(200).json({
      success: true,
      message: "Successfully updated", // Thông báo cập nhật thành công.
      data: updatedUser, // Trả về thông tin người dùng đã cập nhật.
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi.
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Hàm xóa người dùng theo ID.
export const deleteUser = async (req, res) => {
  const id = req.params.id; // Lấy ID từ URL parameters.

  try {
    // Tìm và xóa người dùng theo ID.
    await User.findByIdAndDelete(id);

    // Phản hồi khi xóa thành công.
    res.status(200).json({
      success: true,
      message: "Successfully deleted", // Thông báo xóa thành công.
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi.
    res.status(500).json({ success: false, message: "Failed to delete " });
  }
};

// Hàm lấy thông tin một người dùng duy nhất theo ID.
export const getSingleUser = async (req, res) => {
  const id = req.params.id; // Lấy ID từ URL parameters.

  try {
    // Tìm người dùng theo ID và loại bỏ trường `password` khỏi kết quả.
    const user = await User.findById(id).select("-password");

    // Phản hồi khi tìm thấy người dùng.
    res.status(200).json({
      success: true,
      message: "User found", // Thông báo tìm thấy người dùng.
      data: user, // Trả về thông tin người dùng.
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi.
    res.status(404).json({ success: false, message: "No user found" });
  }
};

// Hàm lấy danh sách tất cả người dùng.
export const getAllUser = async (req, res) => {
  try {
    // Lấy tất cả người dùng và loại bỏ trường `password`.
    const users = await User.find({}).select("-password");

    // Phản hồi khi tìm thấy danh sách người dùng.
    res.status(200).json({
      success: true,
      message: "Users found", // Thông báo tìm thấy người dùng.
      data: users, // Trả về danh sách người dùng.
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi.
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// Hàm lấy thông tin hồ sơ người dùng hiện tại.
export const getUserProfile = async (req, res) => {
  const userId = req.userId; // Lấy ID người dùng từ token.

  try {
    // Tìm thông tin người dùng dựa trên ID.
    const user = await User.findById(userId);

    if (!user) {
      // Nếu không tìm thấy, trả về lỗi.
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Loại bỏ trường `password` khỏi kết quả.
    const { password, ...rest } = user._doc;

    // Phản hồi thông tin hồ sơ người dùng.
    res.status(200).json({
      success: true,
      message: "Profile information is getting", // Thông báo lấy thành công.
      data: { ...rest }, // Trả về thông tin người dùng (không có password).
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi.
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

// Hàm lấy danh sách các lịch hẹn của người dùng hiện tại.
export const getMyAppointments = async (req, res) => {
  try {
    // Lấy danh sách đặt lịch của người dùng hiện tại.
    const bookings = await Booking.find({ user: req.userId });

    // Trích xuất danh sách ID của các bác sĩ từ danh sách đặt lịch.
    const doctorIds = bookings.map((el) => el.doctor.id);

    // Tìm danh sách bác sĩ theo các ID đã trích xuất, loại bỏ trường `password`.
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    // Phản hồi danh sách lịch hẹn cùng thông tin bác sĩ.
    res.status(200).json({
      success: true,
      message: "Appointments are getting", // Thông báo lấy thành công.
      data: doctors, // Trả về danh sách bác sĩ liên quan đến lịch hẹn.
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi.
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

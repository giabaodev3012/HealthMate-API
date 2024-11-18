// Import mô hình User từ file UserSchema.js để tương tác với dữ liệu trong MongoDB.
import User from "../models/UserSchema.js";

import Booking from "../models/BookingSchema.js";

import Doctor from "../models/DoctorSchema.js";

// Hàm cập nhật thông tin người dùng theo ID.
export const updateUser = async (req, res) => {
  const id = req.params.id; // Lấy ID từ URL parameters.

  try {
    // Tìm và cập nhật người dùng theo ID, sử dụng dữ liệu từ body request.
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: req.body }, // Cập nhật các trường trong body request.
      { new: true }
    );

    // Phản hồi khi cập nhật thành công
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedUser,
    });
  } catch (err) {
    // Xử lý lỗi và trả về phản hồi lỗi
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Hàm xóa người dùng theo ID
export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Hàm lấy thông tin một người dùng duy nhất theo ID
export const getSingleUser = async (req, res) => {
  const id = req.params.id;

  try {
    // Tìm người dùng theo ID và loại bỏ trường `password` khỏi kết quả.
    const user = await User.findById(id).select("-password");

    res.status(200).json({
      success: true,
      message: "User found",
      data: user,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No user found" });
  }
};

// Hàm lấy danh sách tất cả người dùng
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      message: "Users found",
      data: users,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    res.status(200).json({
      success: true,
      message: "Profile information is getting",
      data: { ...rest },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    // step 1: retrieve appointments from booking for specific user
    const bookings = await Booking.find({ user: req.userId });

    // step 2: extract doctor ids from appointment bookings
    const doctorIds = bookings.map((el) => el.doctor.id);

    //step 3: retrieve doctors using doctor ids
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

// Import mô hình User từ file UserSchema.js để tương tác với dữ liệu trong MongoDB.
import User from "../models/UserSchema.js";

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

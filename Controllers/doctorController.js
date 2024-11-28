// Import các model cần thiết từ thư mục models.
import Doctor from "../models/DoctorSchema.js"; // Model cho thông tin bác sĩ.
import Booking from "../models/BookingSchema.js"; // Model cho thông tin đặt lịch.

// Hàm cập nhật thông tin bác sĩ dựa trên ID.
export const updateDoctor = async (req, res) => {
  const id = req.params.id; // Lấy ID của bác sĩ từ tham số URL.

  try {
    // Tìm và cập nhật thông tin bác sĩ bằng ID, dựa trên dữ liệu từ req.body.
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body }, // Dữ liệu cập nhật.
      { new: true } // Trả về dữ liệu đã được cập nhật.
    );

    // Gửi phản hồi khi cập nhật thành công.
    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor, // Trả về dữ liệu của bác sĩ sau khi cập nhật.
    });
  } catch (err) {
    // Xử lý lỗi khi cập nhật thất bại.
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

// Hàm xóa thông tin bác sĩ dựa trên ID.
export const deleteDoctor = async (req, res) => {
  const id = req.params.id; // Lấy ID của bác sĩ từ tham số URL.

  try {
    // Tìm và xóa bác sĩ dựa trên ID.
    await Doctor.findByIdAndDelete(id);

    // Gửi phản hồi khi xóa thành công.
    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    // Xử lý lỗi khi xóa thất bại.
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

// Hàm lấy thông tin của một bác sĩ theo ID.
export const getSingleDoctor = async (req, res) => {
  const id = req.params.id; // Lấy ID của bác sĩ từ tham số URL.

  try {
    // Tìm bác sĩ theo ID, đồng thời lấy thông tin reviews và loại bỏ trường password.
    const doctor = await Doctor.findById(id)
      .populate("reviews") // Tự động nối dữ liệu reviews từ collection liên quan.
      .select("-password"); // Không trả về trường password.

    // Gửi phản hồi khi tìm thấy bác sĩ.
    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor, // Trả về thông tin bác sĩ.
    });
  } catch (err) {
    // Xử lý lỗi khi không tìm thấy bác sĩ.
    res.status(404).json({ success: false, message: "No doctor found" });
  }
};

// Hàm lấy danh sách tất cả các bác sĩ hoặc tìm kiếm bác sĩ.
export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query; // Lấy tham số tìm kiếm từ query string của URL.
    let doctors;

    if (query) {
      // Nếu có tham số tìm kiếm, tìm bác sĩ dựa trên tên hoặc chuyên khoa.
      doctors = await Doctor.find({
        isApproved: "approved", // Chỉ lấy bác sĩ đã được phê duyệt.
        $or: [
          { name: { $regex: query, $options: "i" } }, // Tìm tên bác sĩ khớp với chuỗi query (không phân biệt chữ hoa/thường).
          { specialization: { $regex: query, $options: "i" } }, // Tìm chuyên khoa khớp với chuỗi query.
        ],
      }).select("-password"); // Loại bỏ trường password khỏi kết quả.
    } else {
      // Nếu không có tham số tìm kiếm, trả về tất cả bác sĩ đã được phê duyệt.
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    // Gửi phản hồi khi tìm thấy danh sách bác sĩ.
    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors, // Trả về danh sách bác sĩ.
    });
  } catch (err) {
    // Xử lý lỗi khi không tìm thấy bác sĩ.
    res.status(404).json({ success: false, message: "Not found" });
  }
};

// Hàm lấy thông tin hồ sơ của bác sĩ hiện tại.
export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId; // Lấy ID bác sĩ từ token của người dùng (req.userId).
  try {
    // Tìm bác sĩ theo ID.
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      // Nếu không tìm thấy, trả về lỗi.
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    // Loại bỏ trường password trước khi trả về dữ liệu.
    const { password, ...rest } = doctor._doc;

    // Tìm danh sách các lịch hẹn liên quan đến bác sĩ này.
    const appointments = await Booking.find({ doctor: doctorId });

    // Gửi phản hồi với thông tin bác sĩ và danh sách lịch hẹn.
    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments }, // Bao gồm thông tin bác sĩ và danh sách lịch hẹn.
    });
  } catch (err) {
    // Xử lý lỗi nếu có vấn đề trong quá trình lấy dữ liệu.
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

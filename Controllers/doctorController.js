import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";

export const updateDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedDoctor,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update" });
  }
};

export const deleteDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    await Doctor.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete" });
  }
};

export const getSingleDoctor = async (req, res) => {
  const id = req.params.id;

  try {
    const doctor = await Doctor.findById(id)
      .populate("reviews")
      .select("-password");

    res.status(200).json({
      success: true,
      message: "Doctor found",
      data: doctor,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "No doctor found" });
  }
};

export const getAllDoctor = async (req, res) => {
  try {
    const { query } = req.query; // Lấy tham số tìm kiếm 'query' từ URL query string.
    let doctors;

    if (query) {
      // Nếu có tham số tìm kiếm 'query', thực hiện tìm bác sĩ theo tên hoặc chuyên khoa
      doctors = await Doctor.find({
        isApproved: "approved", // Chỉ lấy bác sĩ đã được duyệt (isApproved = 'approved')
        $or: [
          //// Sử dụng toán tử logic OR để tìm bác sĩ theo tên hoặc chuyên khoa
          { name: { $regrex: query, $options: "i" } }, // Tìm kiếm tên bác sĩ theo chuỗi query, không phân biệt chữ hoa/thường (i)
          { specialization: { $regrex: query, $options: "i" } },
        ],
      }).select("-password"); // Loại bỏ trường password khỏi kết quả trả về
    } else {
      // Nếu không có tham số tìm kiếm 'query', chỉ lấy danh sách bác sĩ đã duyệt.
      doctors = await Doctor.find({ isApproved: "approved" }).select(
        "-password"
      );
    }

    res.status(200).json({
      success: true,
      message: "Doctors found",
      data: doctors,
    });
  } catch (err) {
    res.status(404).json({ success: false, message: "Not found" });
  }
};

export const getDoctorProfile = async (req, res) => {
  const doctorId = req.userId;
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }
    const { password, ...rest } = doctor._doc;
    const appointments = await Booking.find({ doctor: doctorId });
    res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest, appointments },
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Something went wrong, cannot get" });
  }
};

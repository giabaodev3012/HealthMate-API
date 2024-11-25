import jwt from "jsonwebtoken"; // Import thư viện JSON Web Token (JWT) để tạo và xác minh token
import Doctor from "../models/DoctorSchema.js"; // Import schema của bác sĩ từ models
import User from "../models/UserSchema.js"; // Import schema của bệnh nhân từ models.

// Middleware `authenticate` để xác minh người dùng có hợp lệ hay không
export const authenticate = async (req, res, next) => {
  // Lấy token từ headers
  const authToken = req.headers.authorization;
  console.log(authToken); // Log token để kiểm tra trong quá trình debug

  // Kiểm tra xem token có tồn tại và có bắt đầu với từ khóa "Bearer" không
  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "No token, authorisation denied" }); // Trả về lỗi 401 nếu không có token
  }

  try {
    // Tách lấy phần token (sau "Bearer ")
    const token = authToken.split(" ")[1];

    // Xác minh token bằng secret key từ file môi trường (.env)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Lưu thông tin người dùng từ token vào `req` để sử dụng ở các middleware/route tiếp theo
    req.userId = decoded.id; // ID người dùng
    req.role = decoded.role; // Vai trò của người dùng (bác sĩ hoặc bệnh nhân)

    next(); // Gọi hàm `next()` để chuyển sang middleware/route tiếp theo
  } catch (err) {
    // Xử lý lỗi token hết hạn
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }

    // Xử lý lỗi token không hợp lệ
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Middleware `restrict` để giới hạn quyền truy cập theo vai trò
export const restrict = (roles) => async (req, res, next) => {
  const userId = req.userId; // Lấy userId từ middleware `authenticate`

  let user; // Biến lưu trữ thông tin người dùng

  // Tìm người dùng dựa trên userId
  const patient = await User.findById(userId); // Tìm trong bảng bệnh nhân
  const doctor = await Doctor.findById(userId); // Tìm trong bảng bác sĩ

  // Gán thông tin user dựa trên vai trò (bệnh nhân hoặc bác sĩ)
  if (patient) {
    user = patient;
  }
  if (doctor) {
    user = doctor;
  }

  // Kiểm tra nếu vai trò của người dùng không nằm trong danh sách được phép (`roles`)
  if (!roles.includes(user.role)) {
    return res
      .status(401)
      .json({ success: false, message: "You're not authorized" }); // Trả về lỗi 401 nếu không đủ quyền
  }

  next(); // Gọi hàm `next()` để chuyển sang middleware/route tiếp theo
};

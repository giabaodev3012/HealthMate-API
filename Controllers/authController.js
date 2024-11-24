import User from "../models/UserSchema.js"; // Import mô-đun User schema từ file UserSchema.js để thao tác với dữ liệu bệnh nhân trong MongoDB.
import Doctor from "../models/DoctorSchema.js"; // Import mô-đun Doctor schema từ file DoctorSchema.js để thao tác với dữ liệu bác sĩ trong MongoDB.
import jwt from "jsonwebtoken"; // Import thư viện jsonwebtoken để tạo và xác thực JSON Web Tokens
import bcrypt from "bcryptjs"; // Import thư viện bcryptjs để mã hóa và kiểm tra mật khẩu

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Payload chứa thông tin người dùng
    process.env.JWT_SECRET_KEY, // Khóa bí mật từ biến môi trường để mã hóa
    {
      expiresIn: "15d", // Token hết hạn sau 15 ngày
    }
  );
};

// Hàm xử lý đăng ký người dùng mới
export const register = async (req, res) => {
  // Lấy thông tin từ body request (email, password, name, role, photo, gender)
  const { email, password, name, role, photo, gender } = req.body;

  try {
    let user = null; // Biến lưu trữ đối tượng người dùng (User hoặc Doctor)

    // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu chưa (bệnh nhân hoặc bác sĩ)
    if (role == "patient") {
      user = await User.findOne({ email }); // Tìm bệnh nhân theo email
    } else if (role == "doctor") {
      user = await Doctor.findOne({ email }); // Tìm bác sĩ theo email
    }

    // Nếu người dùng đã tồn tại, trả về thông báo lỗi
    if (user) {
      return res.status(400).json({ message: "User already exist" });
    }

    // Mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu
    const salt = await bcrypt.genSalt(10); // Tạo salt với độ dài là 10
    const hashPassword = await bcrypt.hash(password, salt); // Mã hóa mật khẩu sử dụng salt

    // Tạo người dùng mới dựa trên role (bệnh nhân hoặc bác sĩ)
    if (role == "patient") {
      user = new User({
        name,
        email,
        password: hashPassword, // Lưu mật khẩu đã mã hóa
        photo,
        gender,
        role,
      });
    }

    if (role == "doctor") {
      user = new Doctor({
        name,
        email,
        password: hashPassword, // Lưu mật khẩu đã mã hóa
        photo,
        gender,
        role,
      });
    }

    // Lưu người dùng vào cơ sở dữ liệu
    await user.save();

    // Trả về phản hồi thành công khi người dùng được tạo
    res
      .status(200)
      .json({ success: true, message: "User successfully created" });
  } catch (err) {
    // Xử lý lỗi nếu có vấn đề trong quá trình tạo người dùng
    res
      .status(500)
      .json({ success: false, message: "Internal server error, try again!" });
  }
};

// Lấy thông tin đăng nhập từ body của request.
export const login = async (req, res) => {
  const { email } = req.body;
  try {
    let user = null;
    const patient = await User.findOne({ email }); // Tìm bệnh nhân theo email trong DB.
    const doctor = await Doctor.findOne({ email }); // Tìm bác sĩ theo email trong DB.

    // Xác định người dùng là bệnh nhân hay bác sĩ.
    if (patient) {
      user = patient;
    }
    if (doctor) {
      user = doctor;
    }

    // check if user exist or not
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // so sánh với password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid credential" });
    }

    // Tạo JWT token cho người dùng đã đăng nhập thành công.
    const token = generateToken(user);

    // Loại bỏ trường không cần thiết trước khi gửi phản hồi.
    const { password, role, appointment, ...rest } = user._doc;

    // Trả về token, dữ liệu người dùng, và vai trò của người dùng.
    res.status(200).json({
      status: true,
      message: "Successfully login",
      token,
      data: { ...rest },
      role,
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Failed to login" });
  }
};

import express from "express";
// Import thư viện Express để tạo ứng dụng web và API.

import cookieParser from "cookie-parser";
// Import middleware để xử lý cookie trong các yêu cầu (request).

import cors from "cors";
// Import middleware để bật CORS (Cross-Origin Resource Sharing)

import mongoose from "mongoose";
// Import Mongoose để làm việc với MongoDB.

import dotenv from "dotenv";
// Import dotenv để quản lý các biến môi trường từ file .env

// Import route xử lý các yêu cầu liên quan đến xác thực người dùng (authentication)
import authRoute from "./Routes/auth.js";

// Import route xử lý các yêu cầu liên quan đến quản lý người dùng (user management).
import userRoute from "./Routes/user.js";

// Import route xử lý các yêu cầu liên quan đến quản lý bác sĩ (doctor management).
import doctorRoute from "./Routes/doctor.js";

//
import reviewRoute from "./Routes/review.js";

import bookingRoute from "./Routes/booking.js";

dotenv.config();
// Tải các biến môi trường từ file .env vào `process.env`

// Tạo một ứng dụng Express
const app = express();

// Lấy cổng từ biến môi trường hoặc mặc định là 8000.
const port = process.env.PORT || 8000;

// Cấu hình CORS
const corsOptions = {
  origin: true,
  // Cho phép tất cả các nguồn truy cập.
};

// Middleware xử lý CORS.
app.use(cors(corsOptions));

// Middleware xử lý cookie.
app.use(cookieParser());

// Middleware để cho phép ứng dụng hiểu JSON trong request body
app.use(express.json());

// Tạo một route GET tại đường dẫn "/"
app.get("/", (req, res) => {
  res.send("API is working");
  // Khi truy cập http://localhost:<port>/, server sẽ trả về chuỗi "API is working"
});

// database connection.
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log("MongoDB database is connected");
  } catch (err) {
    console.log("MongoDB database is connection failed");
  }
};

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

// Lắng nghe kết nối trên cổng đã chỉ định
app.listen(port, () => {
  connectDB();
  // Log thông báo server đã khởi động thành công
  console.log("Server is running on port " + port);
});

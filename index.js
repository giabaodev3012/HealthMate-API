import express from "express";
// Import thư viện Express để tạo ứng dụng web và API

import cookieParser from "cookie-parser";
// Import middleware để xử lý cookie trong các yêu cầu (request)

import cors from "cors";
// Import middleware để bật CORS (Cross-Origin Resource Sharing)

import mongoose from "mongoose";
// Import Mongoose để làm việc với MongoDB

import dotenv from "dotenv";
// Import dotenv để quản lý các biến môi trường từ file .env

import authRoute from "./Routes/auth.js";

dotenv.config();
// Tải các biến môi trường từ file .env vào `process.env`

// Tạo một ứng dụng Express
const app = express();

// Lấy cổng từ biến môi trường hoặc mặc định là 8000
const port = process.env.PORT || 8000;

// Cấu hình CORS
const corsOptions = {
  origin: true,
  // Cho phép tất cả các nguồn truy cập (có thể giới hạn bằng URL cụ thể nếu cần)
};

// Middleware xử lý CORS
app.use(cors(corsOptions));

// Middleware xử lý cookie
app.use(cookieParser());

// Middleware để cho phép ứng dụng hiểu JSON trong request body (nếu cần thêm)
app.use(express.json());

// Tạo một route GET tại đường dẫn "/"
app.get("/", (req, res) => {
  res.send("API is working");
  // Khi truy cập http://localhost:<port>/, server sẽ trả về chuỗi "API is working"
});

// database connection
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

// Lắng nghe kết nối trên cổng đã chỉ định
app.listen(port, () => {
  connectDB();
  // Log thông báo server đã khởi động thành công
  console.log("Server is running on port " + port);
});

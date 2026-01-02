# 🌍 Infinite Spring Portfolio

> Một trang web Portfolio cá nhân với hiệu ứng "Bản đồ vô cực" (Infinite Map/Draggable Canvas) lấy cảm hứng từ Techzen.vn.
> Được xây dựng với **Java Spring Boot** (Backend) và **GSAP** (Frontend).

![Project Status](https://img.shields.io/badge/Status-In%20Development-green)
![Java](https://img.shields.io/badge/Java-17%2B-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen)
![GSAP](https://img.shields.io/badge/GSAP-3.0-blue)

## 📖 Giới thiệu

Dự án này thay thế kiểu cuộn trang dọc truyền thống bằng một **không gian 2D mở**. Người dùng có thể dùng chuột để **kéo (drag)** bản đồ để khám phá các dự án, hoặc dùng menu để camera tự động **bay (fly-to)** đến vị trí nội dung mong muốn.

Dữ liệu các dự án (vị trí, nội dung, hình ảnh) được quản lý tập trung tại Java Backend và phục vụ qua REST API.

## 🚀 Tính năng nổi bật

* **Interactive Map:** Giao diện kéo thả vô tận, quán tính mượt mà (Draggable & Inertia).
* **Smart Navigation:** Hệ thống định vị tọa độ (X, Y) giúp di chuyển camera chính xác đến từng Section.
* **Dynamic Content:** Dữ liệu Portfolio được load động từ Spring Boot API (JSON), dễ dàng mở rộng, kết nối Database.
* **Responsive:** Sử dụng đơn vị `vw/vh`, tương thích tốt trên cả Desktop và Mobile.

## 🛠️ Công nghệ sử dụng

### Backend
* **Java 17+**
* **Spring Boot 3.x** (Web, Thymeleaf, DevTools)
* **Maven** (Quản lý dependencies)

### Frontend
* **HTML5 / CSS3**
* **JavaScript (ES6+)**
* **GSAP (GreenSock Animation Platform):** Core + Draggable Plugin.

## 📂 Cấu trúc dự án

```text
infinite-portfolio/
├── src/
│   ├── main/
│   │   ├── java/com/vien/portfolio/
│   │   │   ├── controller/      # PortfolioController.java (API & View)
│   │   │   ├── model/           # Project.java (Object Model)
│   │   │   └── InfinitePortfolioApplication.java
│   │   ├── resources/
│   │   │   ├── static/
│   │   │   │   ├── css/         # style.css (Giao diện bản đồ)
│   │   │   │   └── js/          # main.js (Logic GSAP & Fetch API)
│   │   │   └── templates/
│   │   │       └── index.html   # View chính
├── pom.xml                      # Maven Config
└── README.md
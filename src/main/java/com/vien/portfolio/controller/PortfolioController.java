package com.vien.portfolio.controller;

import com.vien.portfolio.model.Project;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * 📚 SPRING BOOT: Controller - Xử lý HTTP Requests
 * 
 * MVC Pattern:
 * - Model: Project.java (dữ liệu)
 * - View: index.html (giao diện)
 * - Controller: PortfolioController.java (logic xử lý)
 */

/**
 * 📚 SPRING BOOT: @Controller Annotation
 * 
 * - Đánh dấu class này là Spring MVC Controller
 * - Spring tự động tạo instance (bean) và quản lý lifecycle
 * - Component Scan sẽ tự động detect class này
 */
@Controller
public class PortfolioController {

        /**
         * 📚 SPRING BOOT: @GetMapping("/")
         * 
         * - Map HTTP GET request đến method này
         * - "/" = Root path (http://localhost:8080/)
         * - Return "index": Spring tìm file "index.html" trong /templates
         * 
         * Thymeleaf tự động render index.html và trả về cho browser.
         */
        @GetMapping("/")
        public String home() {
                System.out.println("🏠 Home page requested");
                return "index"; // Trả về view name (index.html)
        }

        /**
         * 📚 SPRING BOOT: REST API Endpoint
         * 
         * @GetMapping("/api/projects"): Map GET request
         * 
         * @ResponseBody: Tự động convert return value sang JSON
         * 
         *                Spring sử dụng Jackson library để serialize Java Objects ->
         *                JSON
         * 
         *                Example JSON Output:
         *                [
         *                {
         *                "id": "p1",
         *                "title": "E-Commerce Platform",
         *                "x": -200,
         *                "y": -150,
         *                ...
         *                }
         *                ]
         */
        @GetMapping("/api/projects")
        @ResponseBody // 📚 Convert Object → JSON
        public List<Project> getProjects() {
                System.out.println("📡 API /api/projects called");

                /**
                 * 📚 JAVA CORE: Collections - List Interface
                 * 
                 * List<Project>: Danh sách các Project objects
                 * - ArrayList: Implementation của List interface
                 * - Generic <Project>: Type-safe, chỉ chứa Project objects
                 * - Dynamic size: Tự động mở rộng khi thêm phần tử
                 */
                List<Project> projects = new ArrayList<>();

                /**
                 * 📚 JAVA CORE: Creating Objects
                 * 
                 * Syntax: new ClassName(arguments)
                 * - 'new' keyword: Allocate memory cho object
                 * - Constructor được gọi để initialize object
                 */
                // City grid layout: Houses on intersections
                projects.add(new Project(
                                "p1",
                                "🛒 E-Commerce Platform",
                                "Full-stack shopping website với Spring Boot + React",
                                -480, // Beside horizontal top road
                                -400, // Offset Y to be ABOVE the road (2500-400=2100)
                                "https://via.placeholder.com/300x200/4F46E5/ffffff?text=E-Commerce",
                                "https://github.com"));

                projects.add(new Project(
                                "p2",
                                "📱 Chat Application",
                                "Real-time messaging app với WebSocket",
                                480, // Beside horizontal top road
                                -400, // Offset Y to be ABOVE the road (2100)
                                "https://via.placeholder.com/300x200/10B981/ffffff?text=Chat+App",
                                "https://github.com"));

                projects.add(new Project(
                                "p3",
                                "🎮 Game Portal",
                                "Mini game collection với HTML5 Canvas",
                                -480, // Beside horizontal bottom road
                                400, // Offset Y to be BELOW the road (2500+400=2900)
                                "https://via.placeholder.com/300x200/F59E0B/ffffff?text=Game+Portal",
                                "https://github.com"));

                projects.add(new Project(
                                "p4",
                                "📊 Analytics Dashboard",
                                "Data visualization với Chart.js",
                                480, // Beside horizontal bottom road
                                400, // Offset Y to be BELOW the road (2900)
                                "https://via.placeholder.com/300x200/EF4444/ffffff?text=Analytics",
                                "https://github.com"));

                projects.add(new Project(
                                "p5",
                                "🎵 Music Player",
                                "Web music player với playlist management",
                                150, // Beside vertical road (2500+150=2650)
                                -500, // On vertical road segment
                                "https://via.placeholder.com/300x200/8B5CF6/ffffff?text=Music+Player",
                                "https://github.com"));

                /**
                 * 📚 SPRING BOOT: Auto JSON Conversion
                 * 
                 * Spring MVC với Jackson sẽ:
                 * 1. Call getter methods của mỗi Project object
                 * 2. Convert sang JSON format
                 * 3. Set Content-Type: application/json
                 * 4. Return JSON response
                 */
                return projects;
        }
}

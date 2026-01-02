package com.vien.portfolio;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 📚 JAVA CORE: Main Class - Entry Point của Java Application
 * 
 * Mọi Java application đều cần 1 main method:
 * public static void main(String[] args)
 * 
 * - public: Có thể truy cập từ bất kỳ đâu
 * - static: Có thể gọi mà không cần tạo object (JVM gọi trực tiếp)
 * - void: Không trả về giá trị
 * - String[] args: Mảng arguments từ command line
 */

/**
 * 📚 SPRING BOOT: @SpringBootApplication Annotation
 * 
 * Annotation này kết hợp 3 annotations:
 * 1. @Configuration: Đánh dấu class này là source của bean definitions
 * 2. @EnableAutoConfiguration: Tự động configure Spring dựa trên dependencies
 * 3. @ComponentScan: Tự động scan và tìm components (Controller, Service, etc.)
 * 
 * Package "com.vien.portfolio" và tất cả sub-packages sẽ được scan.
 */
@SpringBootApplication
public class InfinitePortfolioApplication {

    /**
     * 📚 SPRING BOOT: SpringApplication.run()
     * 
     * Method này:
     * 1. Tạo ApplicationContext (IoC Container - quản lý objects)
     * 2. Start Embedded Tomcat Server (mặc định port 8080)
     * 3. Auto-configure Spring beans
     * 4. Chạy CommandLineRunners (nếu có)
     * 
     * InfinitePortfolioApplication.class: Primary source cho Spring Boot
     * args: Command line arguments được pass vào
     */
    public static void main(String[] args) {
        SpringApplication.run(InfinitePortfolioApplication.class, args);

        System.out.println("🚀 Spring Boot Application Started!");
        System.out.println("📍 Open browser at: http://localhost:8080");
        System.out.println("📡 API endpoint: http://localhost:8080/api/projects");
    }
}

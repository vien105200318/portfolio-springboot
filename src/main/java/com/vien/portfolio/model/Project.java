package com.vien.portfolio.model;

/**
 * 📚 JAVA CORE: Class - Blueprint (Bản thiết kế) để tạo Objects
 * 
 * Class định nghĩa:
 * - Fields (thuộc tính): dữ liệu của object
 * - Methods (phương thức): hành vi của object
 * - Constructor: khởi tạo object
 */

/**
 * 📚 JAVA CORE: Encapsulation (Đóng gói)
 * 
 * Nguyên tắc OOP:
 * - Fields là PRIVATE: Không thể truy cập trực tiếp từ bên ngoài
 * - Getters/Setters là PUBLIC: Truy cập gián tiếp qua methods
 * 
 * Lợi ích:
 * - Kiểm soát: Có thể validate data trong setter
 * - Bảo mật: Ẩn implementation details
 * - Linh hoạt: Thay đổi internal logic mà không ảnh hưng external code
 */
public class Project {

    // 📚 JAVA CORE: Private Fields (Thuộc tính riêng tư)
    // Chỉ truy cập được trong class này
    private String id;
    private String title;
    private String description;
    private double x; // Tọa độ X trên canvas
    private double y; // Tọa độ Y trên canvas
    private String imageUrl;
    private String linkUrl;

    /**
     * 📚 JAVA CORE: Default Constructor (No-args Constructor)
     * 
     * Constructor không tham số, cần cho:
     * - Jackson (JSON serialization/deserialization)
     * - Spring Framework
     * - JPA/Hibernate
     */
    public Project() {
    }

    /**
     * 📚 JAVA CORE: Parameterized Constructor
     * 
     * Constructor với tham số để khởi tạo object với giá trị ban đầu.
     * 
     * @param id          - Unique identifier
     * @param title       - Tên project
     * @param description - Mô tả ngắn
     * @param x           - Tọa độ X
     * @param y           - Tọa độ Y
     * @param imageUrl    - URL hình ảnh
     * @param linkUrl     - URL demo/github
     */
    public Project(String id, String title, String description,
            double x, double y, String imageUrl, String linkUrl) {
        // 📚 JAVA CORE: 'this' keyword
        // Tham chiếu đến current object
        // Phân biệt giữa parameter và field khi trùng tên
        this.id = id;
        this.title = title;
        this.description = description;
        this.x = x;
        this.y = y;
        this.imageUrl = imageUrl;
        this.linkUrl = linkUrl;
    }

    // 📚 JAVA CORE: Getters - Methods để đọc giá trị private fields
    // Convention: get + FieldName (camelCase)

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    // 📚 JAVA CORE: Setters - Methods để gán giá trị cho private fields
    // Convention: set + FieldName (camelCase)

    public void setId(String id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    /**
     * 📚 JAVA CORE: toString() method
     * 
     * Override method từ Object class.
     * Trả về String representation của object (dùng cho debug/log).
     * 
     * @return String representation
     */
    @Override
    public String toString() {
        return "Project{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", x=" + x +
                ", y=" + y +
                '}';
    }
}

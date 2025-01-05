# Employee Management Application

Welcome to the **Employee Management Application**, a comprehensive solution for managing employees, built with modern technologies like **Spring Boot**, **MySQL**, **React**, and **TailwindCSS**. This app focuses on security, efficiency, and usability, offering a seamless experience for administrators to manage employee data.

---

## 🌐 1. Accessing the Website
If you just want to explore the app:
- **Demo Admin Credentials:**
  - Username: `demo`
  - Password: `demo`
- **Website Link:** [Visit the App](#)  

Use the above credentials to log in and explore the features.

---

## 🛠️ 2. Cloning and Setting Up the Project
For users who want to clone and set up the project locally, follow these steps:

### **Clone the Repository**
```bash
git clone <repository-url>
cd <repository-directory>

## Backend Setup
1. **Requirements:**
   - Java 11+
   - MySQL
   - Maven

2. **Steps:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```

   - Create a MySQL database:
     ```sql
     CREATE DATABASE employee_management;
     ```

   - Update the `application.properties` file with your MySQL credentials:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/employee_management
     spring.datasource.username=<your-mysql-username>
     spring.datasource.password=<your-mysql-password>
     ```

   - Build and run the backend:
     ```bash
     mvn clean install
     mvn spring-boot:run
     ```

3. **(Optional) Register a New Admin**  
   If you want to create a new admin for the app, use tools like Postman to call the backend API:
   - **Endpoint:** `/api/admin/register`
   - **Method:** `POST`
   - **Request Body (JSON):**
     ```json
     {
       "username": "newAdmin",
       "email": "admin@example.com",
       "password": "securePassword",
       "phone": "1234567890"
     }
     ```

## Frontend setup
1. **Requirements:**
   - Node.js (v14+)
   - npm or yarn

2. **Steps:**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```

   - Install dependencies:
     ```bash
     npm install
     ```

   - Start the development server:
     ```bash
     npm start
     ```

   - The app will run on `http://localhost:3000`.

✨ 3. Features List
🛡️ Admin Security with JWT and Cookies
Secure login for admins using JWT and cookies for authentication.
Only authenticated admins can access protected endpoints.
🔑 Password Management
Forgot Password: Reset password using OTP sent to the registered email.
Password Update: Change password from the admin profile with secure validation.
📋 Employee Management
Employee List: View all employees on the Employee Page.
Employee Details: View, edit, and delete employee profiles.
Search Bar: Search employees by ID directly from the navbar.
Add Employee: Add new employees easily.
👤 Admin Profile
My Profile: Update admin details like email, phone number, and password.
Email Verification: OTP is sent to the new email during updates.
🔒 Logout
Securely logout the admin session.
🚀 Additional Features
OTP Verification for sensitive actions.
Comprehensive error handling for a smooth user experience.
📝 Contributing
We welcome contributions! Feel free to fork the repository and submit a pull request with your improvements or new features.

📧 Contact
For any queries or suggestions, contact us at: [your-email@example.com]
(Replace with your email)

# Car Showcase - Backend

🚗 **Virtual Car Showroom Backend** | Built with **Node.js, Express, MongoDB, Mongoose**

## 📌 Project Overview
This backend powers the **Car Showcase Web App**, handling data storage, API endpoints, and database operations.

## 📂 Folder Structure & Explanation

### 1️⃣ Configuration
- `config/database.js` → MongoDB connection setup using Mongoose.

### 2️⃣ Models (Schema Definitions)
Located in `models/` folder:
- `Accessories.js` → Defines schema for car accessories.
- `Categories.js` → Stores different accessory & feature categories.
- `Colors.js` → Stores available car colors with hex codes and prices.
- `Features.js` → Defines car features, including images & videos.
- `Models.js` → Stores car model details.
- `Variant.js` → Defines different variants for each model.

### 3️⃣ Routes (API Endpoints)
Located in `routes/` folder:
- `accessoriesRoutes.js` → Handles CRUD operations for accessories.
- `CategoriesRoutes.js` → API endpoints for categories.
- `ColorsRoutes.js` → Manages car color data.
- `FeaturesRoutes.js` → Handles car feature-related API calls.
- `ModelsRoutes.js` → Provides model-related operations.
- `VariantRoutes.js` → Deals with variants for each car model.

### 4️⃣ Seeder (Dummy Data Injection)
- `seeder/seeds.js` → Script to populate the database with initial sample data.

### 5️⃣ Environment Variables
- `.env` → Stores MongoDB connection string and other environment variables.

### 6️⃣ Server Setup
- `server.js` → Main entry point, initializes Express server, sets up middleware, and connects routes.

## 📦 Installed Packages
```bash
npm install express mongoose dotenv cors nodemon
```
- **Express** → Backend framework for API handling
- **Mongoose** → ODM for MongoDB
- **Dotenv** → Manages environment variables
- **CORS** → Enables cross-origin requests
- **Nodemon** → Auto-restarts the server during development

## 🚀 Setup & Run
1. Clone the repository:
   ```bash
   git clone <repo-link>
   ```
2. Navigate to the backend folder:
   ```bash
   cd eccentric-backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   ```
5. Run the server:
   ```bash
   npm start
   ```

## 📝 Note
I was given a **3-day time period** to complete this project, but unfortunately, I became sick and unwell during this time. To adhere to the given deadline, I couldn't fully connect the backend to the frontend or populate the database with proper data. However, I added **dummy data in the frontend** so that the site still has content.

Despite these circumstances, I am submitting my backend code to the GitHub repository to demonstrate that I am fully capable of writing a **proper backend system**. Due to health issues, I couldn't integrate it properly, but the backend structure, models, routes, and API setup are all in place.


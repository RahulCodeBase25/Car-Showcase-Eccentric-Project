const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const variantRoutes = require("./routes/variantRoutes");
const modelsRoutes = require("./routes/modelRoutes"); // Import ModelsRoutes.js

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/carshowcase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Register routes
app.use("/api/variants", variantRoutes);
app.use("/api/models", modelsRoutes); // ✅ Now frontend can access /api/models

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

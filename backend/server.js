require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbConnect = require("./config/database")
const modelRoutes = require("./routes/modelRoutes");
const variantRoutes = require("./routes/variantRoutes");
const featureRoutes = require("./routes/featuresRoutes");
const colorRoutes = require("./routes/colorsRoutes");
const categoryRoutes = require("./routes/categoriesRoutes");
const accessoryRoutes = require("./routes/accessoriesRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/models", modelRoutes);
app.use("/api/variants", variantRoutes);
app.use("/api/features", featureRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/accessories", accessoryRoutes);

dbConnect.then(()=>{
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err)=>{
  console.log('Database Connection Failed🙅‍♂️...');
})

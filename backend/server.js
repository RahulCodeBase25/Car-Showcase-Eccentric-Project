// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const variantRoutes = require("./routes/variantRoutes");

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

app.use("/api/variants", variantRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// frontend/api/fetchVariants.js
export const fetchVariants = async (id = null) => {
  try {
    const url = id ? `/api/variants/${id}` : `/api/variants`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch variants");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching variants:", error);
    return null;
  }
};


// frontend/pages/VariantPage.jsx
import { useEffect, useState } from "react";
import { fetchVariants } from "../api/fetchVariants";

const VariantPage = ({ variantId }) => {
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVariant = async () => {
      const data = await fetchVariants(variantId);
      setVariant(data);
      setLoading(false);
    };
    getVariant();
  }, [variantId]);

  if (loading) return <p>Loading...</p>;
  if (!variant) return <p>Variant not found</p>;

  return (
    <div>
      <h1>{variant.name}</h1>
      <p>Color Options: {variant.colors.map((c) => c.name).join(", ")}</p>
      <p>Features: {variant.features.map((f) => f.name).join(", ")}</p>
    </div>
  );
};

export default VariantPage;

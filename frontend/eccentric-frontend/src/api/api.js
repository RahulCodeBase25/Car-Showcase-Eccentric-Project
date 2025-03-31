import axios from "axios";

const API_BASE_URL = "https://your-api-endpoint.com";

export const fetchCarModels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/models`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car models:", error);
    return [];
  }
};

export const fetchCarColors = async (modelId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cars/${modelId}/colors`);
    return response.data;
  } catch (error) {
    console.error("Error fetching car colors:", error);
    return [];
  }
};

export const fetchCarFeatures = async (modelId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/cars/${modelId}/features`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching car features:", error);
    return [];
  }
};

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const fetchModels = () => axios.get(`${API_BASE_URL}/models`);
export const fetchVariants = (id) => axios.get(`${API_BASE_URL}/variants/${id}`);

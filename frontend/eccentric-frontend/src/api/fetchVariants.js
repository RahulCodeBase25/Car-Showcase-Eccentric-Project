// src/api/fetchVariants.js

import axios from 'axios';

const fetchVariants = async (modelId) => {
    try {
        const response = await axios.get(`/api/variants?model=${modelId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching car variants:", error);
        return [];
    }
};

export default fetchVariants;

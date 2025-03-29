import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchModels } from "../services/api";

const VariantPage = () => {
  const { id } = useParams();
  const [variants, setVariants] = useState([]);

 useEffect(() => {
   fetchModels()
     .then(response => setVariants(response.data))
     .catch(error => console.error("Error fetching models", error));
 }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Variants</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {variants.map(variant => (
          <div key={variant._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{variant.name}</h2>
            <p>Price: {variant.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantPage;

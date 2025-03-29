import { useEffect} from "react";
import { Link } from "react-router-dom";
import useStore from "../store/useStore";
import { fetchModels } from "../services/api";

const HomePage = () => {
  const [models, setModels] = useStore([]);

useEffect(() => {
  fetchModels()
    .then(response => setModels(response.data))
    .catch(error => console.error("Error fetching models", error));
}, [setModels]);


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Available Models</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {models.map(model => (
          <Link key={model._id} to={`/variant/${model._id}`} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{model.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

import { motion } from "framer-motion";
import useStore from "../store/useStore";

const features = [
  { id: 1, name: "Sunroof", type: "image", src: "/assets/images/SunRoof1.png" },
  {
    id: 2,
    name: "360° Camera",
    type: "image",
    src: "/assets/images/360camera.png",
  },
  {
    id: 3,
    name: "Auto-Pilot",
    type: "video",
    src: "/assets/videos/Autopilot.mp4",
  },
  {
    id: 4,
    name: "Ambient Lighting",
    type: "image",
    src: "/assets/images/AmbientLight.png",
  },
];

const FeatureSection = () => {
  const { selectedFeature, setSelectedFeature } = useStore();

  return (
    <div className="py-8 text-center">
      <h2 className="text-3xl font-bold mb-6">Futuristic features</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            className={`p-4 border rounded-lg cursor-pointer ${
              selectedFeature?.id === feature.id
                ? "border-blue-500"
                : "border-gray-300"
            }`}
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelectedFeature(feature)}
          >
            {feature.type === "image" ? (
              <img
                src={feature.src}
                alt={feature.name}
                className="w-full h-48 object-cover"
              />
            ) : (
              <video
                src={feature.src}
                autoPlay
                loop
                muted
                className="w-full h-48 object-cover aspect-video rounded-lg"
              />
            )}

            <p className="mt-2 font-medium">{feature.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;

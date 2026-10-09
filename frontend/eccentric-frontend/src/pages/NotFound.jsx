import { Link } from "react-router-dom";
import CarArt from "../components/CarArt";
import { FindBuild } from "./SavedBuild";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[70vh] flex-col items-center justify-center text-center">
      <CarArt body="hatch" paint="#c9c8c2" wheel={{ style: "aero", finish: "#9da2a8" }} className="w-full max-w-md opacity-80" title="A parked car" />
      <h1 className="display mt-6 text-[clamp(2rem,6vw,3.4rem)]">Wrong turn.</h1>
      <p className="mt-3 text-muted">There's nothing at this address. Have a build code? Open it here.</p>
      <FindBuild className="mt-6" />
      <Link to="/" className="mt-4 underline underline-offset-4">
        Back to the showroom
      </Link>
    </div>
  );
}

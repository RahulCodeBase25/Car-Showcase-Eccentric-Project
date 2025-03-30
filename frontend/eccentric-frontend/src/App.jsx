import RoutesComponent from "./routes";
import Header from "./components/Header";
import "./index.css";

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="content">
        <RoutesComponent />
      </main>
    </div>
  );
}

export default App;

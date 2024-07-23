import "./App.css";
import AvgCropProduction from "./components/AvgCropProduction.tsx";
import MaxCropProduction from "./components/MaxCropProduction.tsx";

function App() {
  return (
    <>
      {/* Add a Project Headline */}
      <h1>Indian Agriculture Dataset</h1>
      {/* Create a container to display that two component */}
      <div className="container">
        <div className="component">
          {/* MaxCropProduction component to see the Maximum & Minimum Crop production of that year */}
          <MaxCropProduction />
        </div>
        <div className="component">
          {/* AvgCropProduction component to see the Average Yield & Cultivation Area of the Crop between 1950 - 2020 */}
          <AvgCropProduction />
        </div>
      </div>
    </>
  );
}

export default App;

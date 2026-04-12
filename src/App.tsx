import { useState } from "react";
import { Header } from "./components/layout/Header.tsx";
import { Footer } from "./components/layout/Footer.tsx";
import { HardwareDashboard } from "./components/hardware/HardwareDashboard.tsx";
import { FilterBar } from "./components/filters/FilterBar.tsx";
import { ModelGrid } from "./components/models/ModelGrid.tsx";
import { useHardware } from "./hooks/useHardware.ts";
import { useHuggingFace } from "./hooks/useHuggingFace.ts";
import { useModels } from "./hooks/useModels.ts";
import { staticModels } from "./data/models.ts";
import "./index.css";

function App() {
  const { specs, loading, refresh: refreshHardware } = useHardware();
  const { models: hfModels } = useHuggingFace();
  const modelManager = useModels(staticModels, hfModels, specs);
  const [detecting, setDetecting] = useState(false);

  const handleDetect = async () => {
    setDetecting(true);
    await refreshHardware();
    // Animation lasts at least 1.5s
    setTimeout(() => setDetecting(false), 1500);
  };

  // Show centered detect button before first detection
  if (!specs && !loading) {
    return (
      <div className="app">
        <div className="landing">
          <h1 className="landing__title">LLM Device Matcher</h1>
          <p className="landing__subtitle">
            Discover the best AI models for your local hardware
          </p>
          <button
            className={`detect-btn${detecting ? " detect-btn--active" : ""}`}
            onClick={handleDetect}
            disabled={detecting}
          >
            <span className="detect-btn__ring" />
            <span className="detect-btn__ring detect-btn__ring--outer" />
            <svg
              className="detect-btn__icon"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" />
              <rect x="9" y="9" width="6" height="6" />
              <line x1="9" y1="1" x2="9" y2="4" />
              <line x1="15" y1="1" x2="15" y2="4" />
              <line x1="9" y1="20" x2="9" y2="23" />
              <line x1="15" y1="20" x2="15" y2="23" />
              <line x1="20" y1="9" x2="23" y2="9" />
              <line x1="20" y1="14" x2="23" y2="14" />
              <line x1="1" y1="9" x2="4" y2="9" />
              <line x1="1" y1="14" x2="4" y2="14" />
            </svg>
          </button>
          <p className="landing__hint">
            {detecting ? "Analyzing hardware..." : "Tap to detect your hardware"}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="loading__spinner" />
          <p className="loading__text">Analyzing Hardware...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="app__container">
        <Header />
        {specs && (
          <HardwareDashboard specs={specs} onRefresh={refreshHardware} />
        )}
        <FilterBar
          filter={modelManager.filter}
          families={modelManager.families}
          quantTypes={modelManager.quantTypes}
          onUpdate={modelManager.updateFilter}
          onReset={modelManager.resetFilter}
          resultCount={modelManager.models.length}
        />
        <ModelGrid
          models={modelManager.models}
          specs={specs}
          getCompat={modelManager.getCompat}
        />
        <Footer />
      </div>
    </div>
  );
}

export default App;

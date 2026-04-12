import { useEffect, useRef } from "react";
import "./CarbonAd.css";

// Replace with your Carbon Ads zone ID after approval
const CARBON_ZONE_ID = "YOUR_ZONE_ID_HERE";

const CARBON_URL = `//cdn.carbonads.com/carbon.js?serve=${CARBON_ZONE_ID}&placement=model-matcherpagesdev`;

export function CarbonAd() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (CARBON_ZONE_ID === "YOUR_ZONE_ID_HERE") return;
    if (!ref.current) return;

    const script = document.createElement("script");
    script.async = true;
    script.type = "text/javascript";
    script.src = CARBON_URL;
    script.id = "_carbonads_js";

    ref.current.appendChild(script);
  }, []);

  if (CARBON_ZONE_ID === "YOUR_ZONE_ID_HERE") {
    return null;
  }

  return (
    <div className="carbon-ad" ref={ref} />
  );
}

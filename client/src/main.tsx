import "./i18n";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function loadAnalytics() {
	const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
	const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();

	if (!analyticsEndpoint || !analyticsWebsiteId) {
		return;
	}

	if (document.getElementById("umami-analytics-script")) {
		return;
	}

	const script = document.createElement("script");
	script.id = "umami-analytics-script";
	script.defer = true;
	script.src = `${analyticsEndpoint.replace(/\/$/, "")}/umami`;
	script.setAttribute("data-website-id", analyticsWebsiteId);
	document.head.appendChild(script);
}

loadAnalytics();

createRoot(document.getElementById("root")!).render(<App />);

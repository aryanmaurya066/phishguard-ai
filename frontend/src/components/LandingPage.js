import { useNavigate } from "react-router-dom";
import Header from './Header';

export default function LandingPage() {
  const navigate = useNavigate();
  // const token = localStorage.getItem("token");
  // const role = localStorage.getItem("role"); // assume you store user role in localStorage
  // const [showDropdown, setShowDropdown] = React.useState(false);
  // const location = useLocation();

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("role");
  //   navigate("/login");
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white font-sans text-slate-900">
        <Header />
      <section className="max-w-6xl mx-auto px-6 py-12 animate-fadeIn">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
          Why PhishGuard?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-transform">
            <h3 className="text-indigo-600 text-xl font-semibold mb-2">
              Modular Detection Engine
            </h3>
            <p>
              Analyze email text, sender, URLs, and web content independently —
              or together for max confidence.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-transform">
            <h3 className="text-indigo-600 text-xl font-semibold mb-2">
              Explainable ML
            </h3>
            <p>
              We show you how phishing is detected — not just a black-box "yes
              or no." Built for learning.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-transform">
            <h3 className="text-indigo-600 text-xl font-semibold mb-2">
              Live Threat Intelligence
            </h3>
            <p>
              Integrates with VirusTotal, PhishTank, and more to enrich results
              with real-time risk data.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-transform">
            <h3 className="text-indigo-600 text-xl font-semibold mb-2">
              Chrome & Gmail Extensions
            </h3>
            <p>
              Detect phishing with one click. From inbox to browser — instant
              protection at your fingertips.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-transform">
            <h3 className="text-indigo-600 text-xl font-semibold mb-2">
              Open Source & Developer Friendly
            </h3>
            <p>
              FastAPI backend, React frontend, MongoDB logs. Clone it. Hack it.
              Learn it.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 hover:-translate-y-1 transition-transform">
            <h3 className="text-indigo-600 text-xl font-semibold mb-2">
              Education & API Ready
            </h3>
            <p>
              Use it in cybersecurity courses, or call the API directly in your
              apps or automation flows.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-indigo-600 text-white text-center py-12 px-4 rounded-xl mx-6 md:mx-auto md:max-w-4xl animate-fadeInUp">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Try It Free</h2>
        <p className="mb-6">
          Paste a suspicious message or URL and get instant phishing verdicts.
          No login required.
        </p>
        <button
          onClick={() => navigate("/analyze/email")}
          className="bg-white text-indigo-700 px-6 py-3 font-semibold rounded-lg shadow hover:bg-indigo-100"
        >
          Analyze Now
        </button>
      </section>

      <footer className="text-center text-sm py-6 bg-gray-100 mt-12">
        &copy; 2025 PhishGuard AI &middot; Built with ❤️ for cybersecurity
        awareness.
      </footer>
    </div>
  );
}

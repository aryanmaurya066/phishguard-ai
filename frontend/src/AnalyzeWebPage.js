import Layout from './components/Layout';
import InputForm from './components/InputForm_web';
import Spinner from './components/Spinner';
import ErrorBox from './components/ErrorBox';
import ResultsCard from './components/Results';
import { useState } from 'react';
import { analyzePhishing } from './api/web_api';

export default function AnalyzePage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await analyzePhishing(payload);
      setResult(res.data);
    } catch (err) {
      setError("Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  return (
        <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Input Form */}
        <div className="bg-white shadow-xl rounded-2xl p-6 h-full">
          <InputForm onSubmit={handleSubmit} />
        </div>

        {/* Right: Result Container with consistent height */}
        <div className="bg-white shadow-xl rounded-2xl p-6 h-full min-h-[500px] flex items-start justify-center">
          {loading && (
            <div className="w-full text-center">
              <Spinner />
            </div>
          )}
          {error && <ErrorBox message={error} />}
          {result && <ResultsCard result={result} />}
          {!loading && !error && !result && (
            <p className="text-gray-500 text-sm text-center">Submit details to view phishing analysis result.</p>
          )}
        </div>
      </div>
    </Layout>
  );
}

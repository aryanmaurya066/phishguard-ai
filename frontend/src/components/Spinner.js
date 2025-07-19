export default function Spinner() {
  return (
    <div className="text-center my-6">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="text-gray-500 mt-2">Analyzing...</p>
    </div>
  );
}
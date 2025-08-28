/**
 * Simple test app to verify basic React setup is working
 */
function TestApp() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          React App Test
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this, React is working correctly!
        </p>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">✅ React rendering</p>
          <p className="text-sm text-gray-500">✅ CSS/Tailwind working</p>
          <p className="text-sm text-gray-500">
            ✅ Basic components functional
          </p>
        </div>
        <div className="mt-6">
          <button
            onClick={() => alert("Click working!")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Click
          </button>
        </div>
      </div>
    </div>
  );
}

export default TestApp;

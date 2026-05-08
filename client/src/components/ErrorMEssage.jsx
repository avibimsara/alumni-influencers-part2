const ErrorMessage = ({ message = 'Something went wrong', onRetry }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="text-4xl mb-3">⚠️</div>
    <p className="text-gray-700 font-medium mb-1">Failed to load data</p>
    <p className="text-sm text-gray-400 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
      >
        Try again
      </button>
    )}
  </div>
);

export default ErrorMessage;
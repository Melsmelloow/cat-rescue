export default function Loading() {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-pulse">
      <div className="h-64 bg-gray-200 rounded-xl mb-6" />
      <div className="h-6 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
    </div>
  );
}
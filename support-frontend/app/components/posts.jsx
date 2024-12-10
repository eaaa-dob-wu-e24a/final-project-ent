export default function Posts({ posts }) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-md p-6">
        <p className="text-center text-gray-500">No posts available.</p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-gray-100 min-h-screen">
      <div className=" mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Ændre opslag
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post.post_id}
              className="bg-white border border-gray-200 flex flex-col justify-between rounded-lg shadow hover:shadow-lg transition-shadow p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {post.product.name.substring(0, 10)}..
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {post.description.substring(0, 50)}...
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Location:</span> {post.location}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Price per Day:</span> $
                {post.price_per_day}
              </p>
              <p className="text-gray-600 text-sm mb-4">
                <span className="font-medium">Brand:</span> {post.product.brand}
              </p>
              <div className="flex justify-between items-center">
                <button className="text-blue-600 hover:underline text-sm">
                  View Details
                </button>
                <button className="bg-red-500 text-white px-4 py-1 rounded text-sm hover:bg-red-600">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

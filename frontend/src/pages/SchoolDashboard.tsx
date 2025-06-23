export default function SchoolDashboard() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-blue-800 text-white p-5">
        <h2 className="text-xl font-bold mb-6">School Panel</h2>
        <nav className="flex flex-col space-y-4">
          <a href="#" className="hover:bg-blue-700 p-2 rounded">
            Post Bid Requests
          </a>
          <a href="#" className="hover:bg-blue-700 p-2 rounded">
            View Supplier Offers
          </a>
          <a href="#" className="hover:bg-blue-700 p-2 rounded">
            Select Winners
          </a>
          <a href="#" className="hover:bg-blue-700 p-2 rounded">
            Payments
          </a>
        </nav>
      </aside>

      <main className="flex-1 p-8 bg-blue-50">
        <h1 className="text-2xl font-semibold mb-4">Welcome, School!</h1>
        {/* School content */}
      </main>
    </div>
  );
}

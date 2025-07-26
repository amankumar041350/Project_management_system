export default function UnauthorizedPage() {
  return (
    <div className="h-screen flex items-center justify-center text-center">
      <div>
        <h1 className="text-3xl text-gray-800 font-bold">Unauthorized</h1>
        <p className="mt-4 text-gray-500">You do not have permission to view this page.</p>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-green-200 text-center px-4">
      <h1 className="text-4xl font-bold text-green-800 mb-4">Welcome to the Auth App</h1>
      <p className="text-lg text-gray-700 mb-6">Start by signing up or logging in</p>
      <div className="space-x-4">
        <Link href="/login">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-200">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-white border border-green-600 hover:bg-green-100 text-green-700 px-6 py-2 rounded-lg shadow-md transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}

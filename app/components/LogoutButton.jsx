"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    localStorage.removeItem("token");

    // Redirect to login
    router.push("/login");

    // Wait a bit then refresh the page
    setTimeout(() => {
      window.location.reload();
    }, 100); // 100ms delay to allow routing to occur
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition duration-200"
    >
      Logout
    </button>
  );
}

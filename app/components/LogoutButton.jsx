"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token"); // remove token from storage
    router.push("/login");            // redirect to login page
  }

  return <button onClick={handleLogout}>Logout</button>;
}

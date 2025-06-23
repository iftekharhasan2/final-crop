import Link from "next/link";

export default function Home() {
  return (
    <main style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to the Auth App</h1>
      <p>Start by signing up or logging in</p>
      <div style={{ marginTop: "20px" }}>
        <Link href="/login"><button style={{ marginRight: "10px" }}>Login</button></Link>
        <Link href="/register"><button>Sign Up</button></Link>
      </div>
    </main>
  );
}

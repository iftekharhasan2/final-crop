import { connectDB } from "../../../lib/mongodb";
import { User } from "../../../lib/userModel";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const { name, email, password, number } = await req.json();

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User with that email already exists" }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      number,
    });

    return new Response(JSON.stringify({ message: "User registered successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

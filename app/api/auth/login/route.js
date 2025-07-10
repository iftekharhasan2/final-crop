import { connectDB } from "../../../lib/mongodb";
import { User } from "../../../lib/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email, number, password } = await req.json();
  await connectDB();

  const user = await User.findOne({
    $or: [
      { email: email || null },
      { number: number || null }
    ]
  });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return Response.json({ error: "Invalid password" }, { status: 401 });

  // ✅ Include both ID and email in the token
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return Response.json({ message: "Login successful", token });
}

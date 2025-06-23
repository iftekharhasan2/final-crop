import { connectDB } from "../../../lib/mongodb";
import { User } from "../../../lib/userModel";
import { NextResponse } from "next/server";

// GET: Get user coin balance
export async function GET(req, { params }) {
  await connectDB();
  const { id } = params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ coins: user.coins });
  } catch (err) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }
}

// PUT: Update user coin balance
export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { delta } = await req.json(); // delta can be positive or negative

  try {
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    user.coins += delta;
    if (user.coins < 0) user.coins = 0; // optional: prevent negative coins

    await user.save();

    return NextResponse.json({ coins: user.coins });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update coins" }, { status: 500 });
  }
}

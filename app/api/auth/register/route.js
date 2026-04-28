import { connectDB } from "@/lib/db";
import { attachAuthCookie, hashPassword, signAccessToken } from "@/lib/auth";
import { handleApiError, ok, fail } from "@/lib/api-response";
import { registerSchema } from "@/lib/validators";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = registerSchema.parse(await request.json());
    await connectDB();

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return fail("Email already in use", 409);
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: await hashPassword(body.password),
    });

    const token = signAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    const response = ok({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    }, 201);

    return attachAuthCookie(response, token);
  } catch (error) {
    return handleApiError(error);
  }
}

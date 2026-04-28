import { connectDB } from "@/lib/db";
import { attachAuthCookie, comparePassword, signAccessToken } from "@/lib/auth";
import { handleApiError, ok, fail } from "@/lib/api-response";
import { loginSchema } from "@/lib/validators";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = loginSchema.parse(await request.json());
    await connectDB();

    const user = await User.findOne({ email: body.email });
    if (!user) {
      return fail("Invalid email or password", 401);
    }

    const passwordMatches = await comparePassword(body.password, user.password);
    if (!passwordMatches) {
      return fail("Invalid email or password", 401);
    }

    const token = signAccessToken({
      userId: String(user._id),
      email: user.email,
      role: user.role,
    });

    const response = ok({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });

    return attachAuthCookie(response, token);
  } catch (error) {
    return handleApiError(error);
  }
}

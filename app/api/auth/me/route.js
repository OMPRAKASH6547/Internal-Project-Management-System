import { requireAuth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { handleApiError, ok } from "@/lib/api-response";
import User from "@/models/User";

export async function GET(request) {
  try {
    const auth = requireAuth(request);
    await connectDB();

    const user = await User.findById(auth.userId).select("_id name email role");
    if (!user) {
      throw new Error("Unauthorized");
    }

    return ok({
      user: { id: String(user._id), name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

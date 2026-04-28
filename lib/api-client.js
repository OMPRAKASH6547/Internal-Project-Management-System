export async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = payload?.details?.fieldErrors;
    const detailMessage =
      details && typeof details === "object"
        ? Object.entries(details)
            .filter(([, messages]) => Array.isArray(messages) && messages.length)
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join(" | ")
        : "";

    throw new Error(detailMessage ? `${payload.error || "Request failed"} - ${detailMessage}` : payload.error || "Request failed");
  }

  return payload;
}

export const authApi = {
  register: (body) => apiRequest("/api/v1/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => apiRequest("/api/v1/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => apiRequest("/api/v1/auth/logout", { method: "POST" }),
  me: () => apiRequest("/api/v1/auth/me"),
};

export const projectsApi = {
  list: () => apiRequest("/api/v1/projects"),
  create: (body) => apiRequest("/api/v1/projects", { method: "POST", body: JSON.stringify(body) }),
};

export const tasksApi = {
  list: (projectId) => apiRequest(`/api/v1/tasks?projectId=${projectId}`),
  create: (body) => apiRequest("/api/v1/tasks", { method: "POST", body: JSON.stringify(body) }),
  update: (taskId, body) => apiRequest(`/api/v1/tasks/${taskId}`, { method: "PATCH", body: JSON.stringify(body) }),
  remove: (taskId) => apiRequest(`/api/v1/tasks/${taskId}`, { method: "DELETE" }),
};

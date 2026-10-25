const SESSION_COOKIE = "cirvia-admin-auth";

let abortController: AbortController | null = null;

export async function syncAuthSessionCookie(authenticated: boolean): Promise<void> {
  abortController?.abort();
  abortController = new AbortController();
  const { signal } = abortController;

  try {
    const response = await fetch("/api/auth/session", {
      method: authenticated ? "POST" : "DELETE",
      credentials: "same-origin",
      cache: "no-store",
      signal,
    });
    if (!response.ok) {
      throw new Error(`Session cookie sync failed (${response.status})`);
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }
    throw error;
  }
}

export { SESSION_COOKIE };

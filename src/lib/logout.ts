export async function logout() {
  try {
    const res = await fetch("http://localhost:3001/sessionLogout", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to log out");
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

export const saveCode = async (language: string, code: string) => {
  try {
    const response = await fetch("/api/saveCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ language, code }),
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      return { error: data.error || "Failed to save code" };
    }
  } catch (error: any) {
    return { error: "Error saving code", details: error.message };
  }
};

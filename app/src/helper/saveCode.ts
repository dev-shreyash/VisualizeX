export const saveCode = async (language: string, username: string, code: string) => {
    try {
      const response = await fetch("/api/saveCode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, username, code }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        return { message: data.message };
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      return { error: "Error saving code", details: error.message };
    }
  };
  
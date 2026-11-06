import crypto from "crypto";

export interface S2SPayload {
  sub: string;
  role?: string;
  scope: "code:execute" | "code:read" | "code:write" | "admin";
  nonce: string;
  iat: number;
  exp: number;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

export function verifyServerAssertion(
  authHeader: string | undefined | null,
  requiredScope?: string
): { success: true; payload: S2SPayload } | { success: false; error: string; status: number } {
  const secret = process.env.INTERNAL_SERVICE_SECRET || "default-insecure-visualizex-secret-change-in-prod";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { success: false, error: "Missing or malformed Authorization header", status: 401 };
  }

  const token = authHeader.slice(7).trim();
  const parts = token.split(".");
  if (parts.length !== 3) {
    return { success: false, error: "Invalid token format", status: 401 };
  }

  const [encodedHeader, encodedPayload, signature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(dataToSign)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf as any, expBuf as any)) {
    return { success: false, error: "Invalid assertion signature", status: 401 };
  }

  try {
    const payload: S2SPayload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp < now) {
      return { success: false, error: "Assertion has expired", status: 401 };
    }

    if (requiredScope && payload.scope !== requiredScope) {
      return { success: false, error: `Unauthorized scope: requires ${requiredScope}`, status: 403 };
    }

    return { success: true, payload };
  } catch (err: any) {
    return { success: false, error: "Malformed assertion payload", status: 400 };
  }
}

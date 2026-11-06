import crypto from "crypto";

export interface S2SPayload {
  sub: string;
  role?: string;
  scope: "code:execute" | "code:read" | "code:write" | "admin";
  nonce: string;
  iat: number;
  exp: number;
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

export function signServerAssertion(
  payload: Omit<S2SPayload, "iat" | "exp" | "nonce">,
  ttlSeconds: number = 60
): string {
  const secret = process.env.INTERNAL_SERVICE_SECRET || "default-insecure-visualizex-secret-change-in-prod";
  const now = Math.floor(Date.now() / 1000);

  const fullPayload: S2SPayload = {
    ...payload,
    nonce: crypto.randomBytes(16).toString("hex"),
    iat: now,
    exp: now + ttlSeconds,
  };

  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataToSign)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${dataToSign}.${signature}`;
}

export function verifyServerAssertion(
  token: string,
  expectedScope?: string
): S2SPayload {
  const secret = process.env.INTERNAL_SERVICE_SECRET || "default-insecure-visualizex-secret-change-in-prod";
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid token format");
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
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    throw new Error("Invalid token signature");
  }

  const payload: S2SPayload = JSON.parse(base64UrlDecode(encodedPayload));
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    throw new Error("Token expired");
  }

  if (expectedScope && payload.scope !== expectedScope) {
    throw new Error(`Scope mismatch: expected ${expectedScope}, got ${payload.scope}`);
  }

  return payload;
}


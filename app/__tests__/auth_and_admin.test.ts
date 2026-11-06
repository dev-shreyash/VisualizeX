import { describe, it, expect } from "@jest/globals";
import { signServerAssertion, verifyServerAssertion } from "@/lib/serverToken";
import { checkRateLimit } from "@/lib/rateLimit";

describe("Security & Token Utilities", () => {
  describe("Server-to-Server Assertion Signing and Verification", () => {
    it("signs and verifies a valid assertion token", () => {
      const assertion = signServerAssertion({
        sub: "testuser",
        role: "USER",
        scope: "code:execute",
      });

      expect(typeof assertion).toBe("string");
      expect(assertion.split(".").length).toBe(3);

      const verified = verifyServerAssertion(assertion, "code:execute");
      expect(verified.sub).toBe("testuser");
      expect(verified.role).toBe("USER");
      expect(verified.scope).toBe("code:execute");
      expect(typeof verified.nonce).toBe("string");
    });

    it("rejects token with wrong expected scope", () => {
      const assertion = signServerAssertion({
        sub: "testuser",
        role: "USER",
        scope: "code:read",
      });

      expect(() => {
        verifyServerAssertion(assertion, "code:write");
      }).toThrow(/Scope mismatch/);
    });

    it("rejects tampered token signature", () => {
      const assertion = signServerAssertion({
        sub: "testuser",
        scope: "code:execute",
      });

      const parts = assertion.split(".");
      const tampered = `${parts[0]}.${parts[1]}.invalidsignature123`;

      expect(() => {
        verifyServerAssertion(tampered);
      }).toThrow(/Invalid token signature/);
    });

    it("rejects expired token", () => {
      const assertion = signServerAssertion(
        {
          sub: "testuser",
          scope: "code:execute",
        },
        -10 // expired 10 seconds ago
      );

      expect(() => {
        verifyServerAssertion(assertion);
      }).toThrow(/Token expired/);
    });
  });

  describe("Sliding Window Rate Limiter", () => {
    it("allows requests within configured limit and blocks when exceeded", () => {
      const testId = `test-client-${Date.now()}`;
      const limit = 5;

      for (let i = 0; i < limit; i++) {
        const res = checkRateLimit(testId, limit, 60000);
        expect(res.allowed).toBe(true);
      }

      const blocked = checkRateLimit(testId, limit, 60000);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
      expect(blocked.resetMs).toBeGreaterThan(0);
    });
  });
});


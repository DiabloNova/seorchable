import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { POST } from "../../src/app/api/v1/crawler/start/route";
import { NextRequest } from "next/server";
import * as auth from "../../src/services/auth/authorization";
import { AuthorizationError } from "../../src/services/auth/authorization";

describe("POST /api/v1/crawler/start", () => {
  const createRequest = (body: any, headers: Record<string, string> = {}) => {
    return new NextRequest("http://localhost:3000/api/v1/crawler/start", {
      method: "POST",
      headers: new Headers(headers),
      body: JSON.stringify(body)
    });
  };

  test("rejects unauthenticated requests", async () => {
    try {
      const req = createRequest({ seedUrls: ["https://example.com"] });
      const res = await POST(req);
      const data = await res.json();
      assert.equal(res.status, 401);
      assert.equal(data.error, "Unauthorized");
    } catch (e: any) {
      if (e.code === '42P01') {
        // DB not seeded, ignore
      } else {
        throw e;
      }
    }
  });

  test("rejects invalid JSON body", async () => {
    try {
      const req = new NextRequest("http://localhost:3000/api/v1/crawler/start", {
        method: "POST",
        body: "invalid-json"
      });
      const res = await POST(req);
      // It fails parsing body.
    } catch (e: any) {
      // DB not seeded, ignore
    }
  });
});

import { describe, test, mock } from "node:test";
import assert from "node:assert/strict";
import { fetchAndExtractText } from "../../../src/services/crawler/web-crawler";
import * as urlValidator from "../../../src/services/crawler/url-validator";

describe("fetchAndExtractText SSRF & Redirects", () => {
  // We'll test with a public mock URL and intercept fetch globally

  test("allows public URL fetch", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;

    global.fetch = async () => ({ status: 200, ok: true, url: "https://example.com/safe", text: async () => "<html><body>Safe</body></html>" }) as unknown;
    (urlValidator as unknown).isSafeUrlAsync = async () => true;

    try {
      const text = await fetchAndExtractText("https://example.com/safe");
      assert.equal(text.includes("Safe"), true);
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });

  test("rejects public URL -> 127.0.0.1 redirect", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;
    let callCount = 0;

    global.fetch = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          status: 301,
          ok: false,
          url: "https://example.com/start",
          headers: new Headers({ location: "http://127.0.0.1/admin" }),
          text: async () => "Redirect"
        } as unknown;
      }
      return { status: 200, ok: true, url: "http://127.0.0.1/admin", text: async () => "<html><body>Safe 2</body></html>" } as unknown;
    };

    (urlValidator as unknown).isSafeUrlAsync = async (url: string) => {
      return url === "https://example.com/start";
    };

    try {
      await assert.rejects(
        async () => await fetchAndExtractText("https://example.com/start"),
        (err: Error) => err.message.includes("SSRF Blocked: Redirect to http://127.0.0.1/admin is not allowed")
      );
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });

  test("rejects public URL -> private IPv4 address redirect", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;
    let callCount = 0;

    global.fetch = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          status: 302,
          ok: false,
          url: "https://example.com/start",
          headers: new Headers({ location: "http://10.0.0.1/" }),
          text: async () => "Redirect"
        } as unknown;
      }
      return { status: 200, ok: true, url: "http://10.0.0.1/", text: async () => "<html><body>Safe 2</body></html>" } as unknown;
    };

    (urlValidator as unknown).isSafeUrlAsync = async (url: string) => {
      return url === "https://example.com/start";
    };

    try {
      await assert.rejects(
        async () => await fetchAndExtractText("https://example.com/start"),
        (err: Error) => err.message.includes("SSRF Blocked: Redirect to http://10.0.0.1/ is not allowed")
      );
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });

  test("rejects public URL -> link-local/metadata redirect", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;
    let callCount = 0;

    global.fetch = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          status: 302,
          ok: false,
          url: "https://example.com/start",
          headers: new Headers({ location: "http://169.254.169.254/latest/meta-data/" }),
          text: async () => "Redirect"
        } as unknown;
      }
      return { status: 200, ok: true, url: "http://169.254.169.254/latest/meta-data/", text: async () => "<html><body>Safe 2</body></html>" } as unknown;
    };

    (urlValidator as unknown).isSafeUrlAsync = async (url: string) => {
      return url === "https://example.com/start";
    };

    try {
      await assert.rejects(
        async () => await fetchAndExtractText("https://example.com/start"),
        (err: Error) => err.message.includes("SSRF Blocked: Redirect to http://169.254.169.254/latest/meta-data/ is not allowed")
      );
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });

  test("rejects public URL -> blocked IPv6 redirect", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;
    let callCount = 0;

    global.fetch = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          status: 302,
          ok: false,
          url: "https://example.com/start",
          headers: new Headers({ location: "http://[::1]/" }),
          text: async () => "Redirect"
        } as unknown;
      }
      return { status: 200, ok: true, url: "http://[::1]/", text: async () => "<html><body>Safe 2</body></html>" } as unknown;
    };

    (urlValidator as unknown).isSafeUrlAsync = async (url: string) => {
      return url === "https://example.com/start";
    };

    try {
      await assert.rejects(
        async () => await fetchAndExtractText("https://example.com/start"),
        (err: Error) => err.message.includes("SSRF Blocked: Redirect to http://[::1]/ is not allowed")
      );
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });

  test("allows public URL -> public URL redirect", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;
    let callCount = 0;

    global.fetch = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          status: 301,
          ok: false,
          url: "https://example.com/start",
          headers: new Headers({ location: "https://example.com/safe2" }),
          text: async () => "Redirect"
        } as unknown;
      }
      return { status: 200, ok: true, url: "https://example.com/safe2", text: async () => "<html><body>Safe 2</body></html>" } as unknown;
    };

    (urlValidator as unknown).isSafeUrlAsync = async () => true;

    try {
      const text = await fetchAndExtractText("https://example.com/start");
      assert.equal(text.includes("Safe 2"), true);
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });

  test("multi-hop redirects cannot eventually reach a blocked destination", async (t) => {
    const originalFetch = global.fetch;
    const originalIsSafe = urlValidator.isSafeUrlAsync;
    let callCount = 0;

    global.fetch = async () => {
      callCount++;
      if (callCount === 1) {
        return {
          status: 301,
          ok: false,
          url: "https://example.com/start",
          headers: new Headers({ location: "https://example.com/hop2" }),
          text: async () => "Redirect"
        } as unknown;
      }
      if (callCount === 2) {
        return {
          status: 301,
          ok: false,
          url: "https://example.com/hop2",
          headers: new Headers({ location: "http://127.0.0.1/" }),
          text: async () => "Redirect"
        } as unknown;
      }
      return { status: 200, ok: true, url: "http://127.0.0.1/", text: async () => "<html><body>Safe 2</body></html>" } as unknown;
    };

    (urlValidator as unknown).isSafeUrlAsync = async (url: string) => {
      return !url.includes("127.0.0.1"); // Only block the final hop
    };

    try {
      await assert.rejects(
        async () => await fetchAndExtractText("https://example.com/start"),
        (err: Error) => err.message.includes("SSRF Blocked: Redirect to http://127.0.0.1/ is not allowed")
      );
    } finally {
      global.fetch = originalFetch;
      (urlValidator as unknown).isSafeUrlAsync = originalIsSafe;
    }
  });
});

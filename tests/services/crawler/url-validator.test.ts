import { test } from "node:test";
import assert from "node:assert/strict";
import { isSafeUrlAsync } from "../../../src/services/crawler/url-validator";

test("isSafeUrl accepts valid public URLs", async () => {
  assert.equal(await isSafeUrlAsync("https://example.com"), true);
  assert.equal(await isSafeUrlAsync("http://public.com/path"), true);
});

test("isSafeUrl rejects invalid formats", async () => {
  assert.equal(await isSafeUrlAsync("not-a-url"), false);
});

test("isSafeUrl rejects non-http/https schemes", async () => {
  assert.equal(await isSafeUrlAsync("file:///etc/passwd"), false);
  assert.equal(await isSafeUrlAsync("ftp://192.168.1.1"), false);
  assert.equal(await isSafeUrlAsync("gopher://localhost"), false);
});

test("isSafeUrl rejects localhost and loopback", async () => {
  assert.equal(await isSafeUrlAsync("http://localhost"), false);
  assert.equal(await isSafeUrlAsync("http://localhost:8080"), false);
  assert.equal(await isSafeUrlAsync("https://ip6-localhost"), false);
  assert.equal(await isSafeUrlAsync("http://127.0.0.1"), false);
  assert.equal(await isSafeUrlAsync("http://127.0.0.1:3000/api"), false);
  assert.equal(await isSafeUrlAsync("http://[::1]"), false);
});

test("isSafeUrl rejects private IPv4 ranges", async () => {
  assert.equal(await isSafeUrlAsync("http://10.0.0.1"), false);
  assert.equal(await isSafeUrlAsync("http://172.16.0.1"), false);
  assert.equal(await isSafeUrlAsync("http://172.31.255.255"), false);
  assert.equal(await isSafeUrlAsync("http://192.168.1.100"), false);
});

test("isSafeUrl rejects link-local and cloud metadata", async () => {
  assert.equal(await isSafeUrlAsync("http://169.254.169.254/latest/meta-data/"), false);
});

test("isSafeUrl rejects 0.0.0.0", async () => {
  assert.equal(await isSafeUrlAsync("http://0.0.0.0:8080"), false);
});

test("isSafeUrl rejects local IPv6 addresses", async () => {
  assert.equal(await isSafeUrlAsync("http://[fc00::1]"), false);
  assert.equal(await isSafeUrlAsync("http://[fe80::1]"), false);
});

test("isSafeUrlAsync checks DNS resolving to private IP", async (t) => {
  import dns from "node:dns/promises";
  const originalLookup = dns.lookup;
  dns.lookup = async () => ({ address: "192.168.1.5", family: 4 });

  try {
    const result = await isSafeUrlAsync("https://legit-looking-domain.com");
    assert.equal(result, false);
  } finally {
    dns.lookup = originalLookup;
  }
});

test("isSafeUrlAsync handles DNS lookup failure by blocking", async (t) => {
  import dns from "node:dns/promises";
  const originalLookup = dns.lookup;
  dns.lookup = async () => { throw new Error("NXDOMAIN"); };

  try {
    const result = await isSafeUrlAsync("https://unresolvable.com");
    assert.equal(result, false);
  } finally {
    dns.lookup = originalLookup;
  }
});

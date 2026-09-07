import { test } from "node:test";
import assert from "node:assert/strict";
import { isSafeUrl } from "../../../src/services/crawler/url-validator";

test("isSafeUrl accepts valid public URLs", () => {
  assert.equal(isSafeUrl("https://example.com"), true);
  assert.equal(isSafeUrl("http://public.com/path"), true);
});

test("isSafeUrl rejects invalid formats", () => {
  assert.equal(isSafeUrl("not-a-url"), false);
});

test("isSafeUrl rejects non-http/https schemes", () => {
  assert.equal(isSafeUrl("file:///etc/passwd"), false);
  assert.equal(isSafeUrl("ftp://192.168.1.1"), false);
  assert.equal(isSafeUrl("gopher://localhost"), false);
});

test("isSafeUrl rejects localhost and loopback", () => {
  assert.equal(isSafeUrl("http://localhost"), false);
  assert.equal(isSafeUrl("http://localhost:8080"), false);
  assert.equal(isSafeUrl("https://ip6-localhost"), false);
  assert.equal(isSafeUrl("http://127.0.0.1"), false);
  assert.equal(isSafeUrl("http://127.0.0.1:3000/api"), false);
  assert.equal(isSafeUrl("http://[::1]"), false);
});

test("isSafeUrl rejects private IPv4 ranges", () => {
  assert.equal(isSafeUrl("http://10.0.0.1"), false);
  assert.equal(isSafeUrl("http://172.16.0.1"), false);
  assert.equal(isSafeUrl("http://172.31.255.255"), false);
  assert.equal(isSafeUrl("http://192.168.1.100"), false);
});

test("isSafeUrl rejects link-local and cloud metadata", () => {
  assert.equal(isSafeUrl("http://169.254.169.254/latest/meta-data/"), false);
});

test("isSafeUrl rejects 0.0.0.0", () => {
  assert.equal(isSafeUrl("http://0.0.0.0:8080"), false);
});

test("isSafeUrl rejects local IPv6 addresses", () => {
  assert.equal(isSafeUrl("http://[fc00::1]"), false);
  assert.equal(isSafeUrl("http://[fe80::1]"), false);
});

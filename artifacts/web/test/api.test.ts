import { afterEach, describe, expect, it, vi } from "vitest";
import { api, ApiError } from "../src/lib/api";

const respond = (status: number, body: string) =>
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(body, { status })),
  );

afterEach(() => vi.unstubAllGlobals());

describe("api", () => {
  it("GETs under /api with credentials and parses JSON", async () => {
    respond(200, '{"a":1}');
    expect(await api("/x")).toEqual({ a: 1 });
    const [url, init] = (fetch as any).mock.calls[0];
    expect(url).toBe("/api/x");
    expect(init).toMatchObject({ method: "GET", credentials: "include", body: undefined });
  });
  it("POSTs a JSON body when one is given", async () => {
    respond(200, "{}");
    await api("/x", { body: { n: 1 } });
    const [, init] = (fetch as any).mock.calls[0];
    expect(init).toMatchObject({ method: "POST", body: '{"n":1}', headers: { "content-type": "application/json" } });
  });
  it("returns null for an empty body and text for non-JSON", async () => {
    respond(200, "");
    expect(await api("/x")).toBeNull();
    respond(200, "ok");
    expect(await api("/x")).toBe("ok");
  });
  it("throws ApiError with the server's message", async () => {
    respond(401, '{"error":"nope"}');
    await expect(api("/x")).rejects.toMatchObject({ status: 401, message: "nope" });
    respond(400, '{"errors":["bad query"]}');
    await expect(api("/x")).rejects.toThrow("bad query");
    respond(500, "boom");
    await expect(api("/x")).rejects.toBeInstanceOf(ApiError);
  });
});

import { assertEquals } from "jsr:@std/assert";
import { add } from "../mod.ts";

Deno.test("add", () => {
  assertEquals(add(1, 2), 3);
});
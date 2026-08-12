import { describe, expect, it } from "@jest/globals";
import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";

const sourceRoot = join(process.cwd(), "src");

function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

describe("mobile architecture guards", () => {
  const files = filesUnder(sourceRoot);

  it("keeps application source in JavaScript", () => {
    expect(files.filter((file) => [".ts", ".tsx"].includes(extname(file)))).toEqual([]);
  });

  it("never introduces AsyncStorage or browser token persistence", () => {
    const source = files
      .filter((file) => [".js", ".jsx"].includes(extname(file)))
      .map((file) => readFileSync(file, "utf8"))
      .join("\n");
    expect(source).not.toMatch(/AsyncStorage|localStorage|sessionStorage/);
  });

  it("keeps dense administration routes in the web client", () => {
    const routes = files
      .filter((file) => file.includes(`${join("src", "app")}`))
      .map((file) => file.replace(sourceRoot, ""))
      .join("\n");
    expect(routes).not.toMatch(/admin|audit|report/i);
  });
});

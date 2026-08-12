import { spawnSync } from "node:child_process";

const audit = spawnSync("npm", ["audit", "--json"], { encoding: "utf8" });
if (!audit.stdout) {
  process.stderr.write(audit.stderr || "npm audit did not return JSON.\n");
  process.exit(1);
}

let report;
try {
  report = JSON.parse(audit.stdout);
} catch {
  process.stderr.write("npm audit returned invalid JSON.\n");
  process.exit(1);
}

const vulnerabilities = report.vulnerabilities ?? {};
if (Object.keys(vulnerabilities).length === 0) {
  process.stdout.write("npm audit: no known vulnerabilities.\n");
  process.exit(0);
}

const advisoryRoots = Object.entries(vulnerabilities).filter(([, vulnerability]) =>
  vulnerability.via.some((item) => typeof item === "object"),
);
const allowedSources = new Set([1138808, 1138809]);
const imageSize = vulnerabilities["image-size"];
const sources = new Set(
  (imageSize?.via ?? [])
    .filter((item) => typeof item === "object")
    .map((item) => item.source),
);
const exactAllowedRoot =
  advisoryRoots.length === 1 &&
  advisoryRoots[0][0] === "image-size" &&
  sources.size === allowedSources.size &&
  [...sources].every((source) => allowedSources.has(source));

const allowedAffected = new Set([
  "@expo/cli",
  "@expo/metro",
  "@expo/metro-config",
  "@react-native/community-cli-plugin",
  "@react-native/metro-config",
  "@react-native/virtualized-lists",
  "@testing-library/react-native",
  "expo",
  "image-size",
  "metro",
  "metro-config",
  "metro-transform-worker",
  "react-native",
  "react-native-reanimated",
  "react-native-worklets",
]);
const actualAffected = new Set(Object.keys(vulnerabilities));
const unexpected = [...actualAffected].filter((name) => !allowedAffected.has(name));
const missing = [...allowedAffected].filter((name) => !actualAffected.has(name));
const critical = report.metadata?.vulnerabilities?.critical ?? 0;
if (!exactAllowedRoot || unexpected.length > 0 || missing.length > 0 || critical > 0) {
  process.stderr.write(
    `Security audit failed; unexpected=${unexpected.join(",") || "none"}, ` +
      `missing=${missing.join(",") || "none"}, critical=${critical}.\n`,
  );
  process.exit(1);
}

process.stdout.write(
  `npm audit: ${Object.keys(vulnerabilities).length} transitive paths accepted only for ` +
    "GHSA-w3rx-r6r6-pgpr and GHSA-5p2g-fcmc-qvqq (image-size via Metro).\n",
);

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const feature = await readFile(resolve(root, "specs/acceptance/HU-019-mobile-client.feature"), "utf8");
const traceability = await readFile(resolve(root, "specs/traceability.yaml"), "utf8");
const contract = JSON.parse(await readFile(resolve(root, "specs/api-contract.json"), "utf8"));
const profile = contract.profiles["render-v1"];

const featureIds = [...feature.matchAll(/^\s*@(HU-019-S\d+)\s*$/gm)].map((match) => match[1]);
const traceIds = [...traceability.matchAll(/^\s{2}(HU-019-S\d+):\s*$/gm)].map((match) => match[1]);
const requiredOperations = [...traceability.matchAll(/^\s+operations: \[(.+)\]\s*$/gm)]
  .flatMap((match) => match[1].split(",").map((operation) => operation.trim()).filter(Boolean));

if (!featureIds.length || new Set(featureIds).size !== featureIds.length) {
  throw new Error("Feature scenarios must have unique acceptance identifiers.");
}

if (featureIds.length !== traceIds.length || featureIds.some((id) => !traceIds.includes(id))) {
  throw new Error("Every feature acceptance identifier must have one traceability row.");
}

if (!profile) throw new Error("The Render v1 profile is required for traceability validation.");

const contractOperations = new Set(profile.requiredOperations);
const missingOperations = requiredOperations.filter((operation) => !contractOperations.has(operation));

if (missingOperations.length) {
  throw new Error(`Traceability references unknown contract operations: ${missingOperations.join(", ")}`);
}

console.log(`Traceability verified: ${featureIds.length} scenarios, ${requiredOperations.length} operations.`);

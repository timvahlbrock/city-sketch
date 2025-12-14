import { exportJWK, exportPKCS8, generateKeyPair } from "jose";
import * as childProcess from "node:child_process";

const keys = await generateKeyPair("RS256", {
  extractable: true,
});
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });
const stringifiedPrivateKey = privateKey.trimEnd().replace(/\n/g, " ");

childProcess.spawnSync(
  `npx convex env set JWT_PRIVATE_KEY "${stringifiedPrivateKey}"`,
  {
    stdio: "inherit",
  },
);
childProcess.spawnSync(`npx convex env set JWKS "${jwks}"`, {
  stdio: "inherit",
});

process.stdout.write(`JWT_PRIVATE_KEY="${stringifiedPrivateKey}"`);
process.stdout.write("\n");
process.stdout.write(`JWKS=${jwks}`);
process.stdout.write("\n");

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const contract = JSON.parse(fs.readFileSync("workspace-dependency-contract.json", "utf8"));

assert.equal(contract.status, "OPTIONAL_WORKSPACE_ONLY");
assert.deepEqual(Object.keys(contract.commands).sort(), ["build", "check", "test"]);
assert.equal(contract.outcomes.dependency_missing_exit_code, 2);
assert.equal(contract.outcomes.dependency_missing_status, "WORKSPACE_DEPENDENCY_UNAVAILABLE");

const emptyWorkspace = fs.mkdtempSync(path.join(os.tmpdir(), "riverbraid-gold-v2-empty-workspace-"));

try {
  for (const command of Object.keys(contract.commands)) {
    const result = spawnSync(process.execPath, ["scripts/run-workspace-command.mjs", command], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        RIVERBRAID_WORKSPACE_ROOT: emptyWorkspace
      },
      encoding: "utf8"
    });

    assert.equal(result.status, 2, `${command} should return the declared unavailable exit code`);

    const output = JSON.parse(result.stdout);
    assert.equal(output.status, "WORKSPACE_DEPENDENCY_UNAVAILABLE");
    assert.equal(output.command, command);
    assert.equal(output.contract_id, contract.record_id);
    assert.equal(output.workspace_root, emptyWorkspace);
    assert.equal(typeof output.dependency, "string");
    assert.equal(output.dependency.length > 0, true);
  }

  console.log("GOLD_V2_WORKSPACE_BOUNDARY_PASS");
} finally {
  fs.rmSync(emptyWorkspace, { recursive: true, force: true });
}

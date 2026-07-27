import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const commandName = process.argv[2];
const contract = JSON.parse(fs.readFileSync("workspace-dependency-contract.json", "utf8"));
const command = contract.commands?.[commandName];

function emit(status, details = {}) {
  console.log(JSON.stringify({
    status,
    command: commandName ?? null,
    contract_id: contract.record_id,
    contract_version: contract.version,
    ...details
  }, null, 2));
}

if (!command) {
  emit("INVALID_WORKSPACE_COMMAND", {
    allowed_commands: Object.keys(contract.commands ?? {})
  });
  process.exit(64);
}

const workspaceRoot = process.env.RIVERBRAID_WORKSPACE_ROOT
  ? path.resolve(process.env.RIVERBRAID_WORKSPACE_ROOT)
  : path.resolve(process.cwd(), "..");
const dependencyPath = path.join(workspaceRoot, command.dependency);

if (!fs.existsSync(dependencyPath) || !fs.statSync(dependencyPath).isDirectory()) {
  emit(contract.outcomes.dependency_missing_status, {
    dependency: command.dependency,
    workspace_root: workspaceRoot,
    dependency_path: dependencyPath,
    claim_effect: contract.claim_effect
  });
  process.exit(contract.outcomes.dependency_missing_exit_code);
}

function run(executable, args, cwd, phase) {
  const result = spawnSync(executable, args, {
    cwd,
    stdio: "inherit",
    shell: false
  });

  if (result.error) {
    emit(contract.outcomes.command_failure_status, {
      phase,
      executable,
      arguments: args,
      cwd,
      error: result.error.message
    });
    process.exit(1);
  }

  if (result.status !== 0) {
    emit(contract.outcomes.command_failure_status, {
      phase,
      executable,
      arguments: args,
      cwd,
      exit_code: result.status
    });
    process.exit(result.status ?? 1);
  }
}

if (command.local_precommand) {
  run(
    command.local_precommand.executable,
    command.local_precommand.arguments,
    process.cwd(),
    "LOCAL_PRECOMMAND"
  );
}

run(command.executable, command.arguments, dependencyPath, "WORKSPACE_DEPENDENCY_COMMAND");

emit(contract.outcomes.success_status, {
  dependency: command.dependency,
  workspace_root: workspaceRoot,
  dependency_path: dependencyPath
});

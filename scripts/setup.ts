#!/usr/bin/env bun
/**
 * Auto-Setup Script for New Users
 *
 * Provides seamless VCS onboarding by automating environment setup.
 * Eliminates manual configuration and ensures consistent development environments.
 *
 * Usage: bun run scripts/setup.ts [--check] [--force]
 *
 * Options:
 *   --check   Validate environment without making changes
 *   --force   Force reinstallation of dependencies
 */

import { $ } from "bun";
import { existsSync, rmSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { join, resolve, sep } from "path";

const ROOT_DIR = join(import.meta.dir, "..");
const ATOM_TRAIL_DIR = join(ROOT_DIR, ".atom-trail");

interface SetupOptions {
  check: boolean;
  force: boolean;
}

interface SetupResult {
  success: boolean;
  steps: Array<{
    name: string;
    status: "passed" | "failed" | "skipped";
    message: string;
  }>;
  timestamp: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): SetupOptions {
  const args = process.argv.slice(2);
  return {
    check: args.includes("--check"),
    force: args.includes("--force"),
  };
}

/**
 * Print styled output
 */
function log(
  type: "info" | "success" | "warn" | "error" | "step",
  message: string
): void {
  const icons = {
    info: "ℹ️ ",
    success: "✅",
    warn: "⚠️ ",
    error: "❌",
    step: "🔧",
  };
  console.log(`${icons[type]} ${message}`);
}

/**
 * Check if Bun is installed and meets minimum version
 */
async function checkBunVersion(): Promise<{
  passed: boolean;
  version: string;
}> {
  try {
    const result = await $`bun --version`.text();
    const version = result.trim();
    // Handle pre-release versions like 1.0.0-beta.1 by extracting base version
    const baseVersion = version.split("-")[0];
    const parts = baseVersion?.split(".") ?? [];
    const major = Number.parseInt(parts[0] ?? "0", 10);

    // Require Bun 1.0.0 or higher
    const passed = !Number.isNaN(major) && major >= 1;
    return { passed, version };
  } catch {
    return { passed: false, version: "not installed" };
  }
}

/**
 * Check if dependencies are installed
 */
function checkDependencies(): boolean {
  return existsSync(join(ROOT_DIR, "node_modules"));
}

/**
 * Install dependencies
 */
async function installDependencies(force: boolean): Promise<boolean> {
  try {
    const nodeModulesPath = join(ROOT_DIR, "node_modules");
    if (force) {
      log("step", "Force reinstalling dependencies...");
      // Validate path before removal for security
      // Ensure the resolved path is within the project directory
      const resolvedNodeModules = resolve(nodeModulesPath);
      const resolvedRoot = resolve(ROOT_DIR);
      
      // Check that the path is within the project directory
      // and specifically points to the node_modules folder
      const isWithinProject = 
        resolvedNodeModules.startsWith(resolvedRoot + sep) &&
        resolvedNodeModules === join(resolvedRoot, "node_modules");
      
      if (existsSync(nodeModulesPath) && isWithinProject) {
        rmSync(nodeModulesPath, { recursive: true, force: true });
      }
      await $`cd ${ROOT_DIR} && bun install`.quiet();
    } else {
      log("step", "Installing dependencies...");
      await $`cd ${ROOT_DIR} && bun install`.quiet();
    }
    return true;
  } catch (error) {
    log("error", `Failed to install dependencies: ${error}`);
    return false;
  }
}

/**
 * Setup ATOM trail directory for provenance tracking
 */
async function setupAtomTrail(): Promise<boolean> {
  try {
    const dirs = [
      ATOM_TRAIL_DIR,
      join(ATOM_TRAIL_DIR, "counters"),
      join(ATOM_TRAIL_DIR, "decisions"),
    ];

    for (const dir of dirs) {
      if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true });
      }
    }

    // Add .gitkeep files to preserve directory structure
    for (const dir of dirs.slice(1)) {
      const gitkeep = join(dir, ".gitkeep");
      if (!existsSync(gitkeep)) {
        await writeFile(gitkeep, "");
      }
    }

    return true;
  } catch (error) {
    log("error", `Failed to setup ATOM trail: ${error}`);
    return false;
  }
}

/**
 * Verify TypeScript configuration
 */
function checkTypeScriptConfig(): boolean {
  return existsSync(join(ROOT_DIR, "tsconfig.json"));
}

/**
 * Run tests to verify setup
 */
async function runTests(): Promise<boolean> {
  try {
    await $({ cwd: ROOT_DIR })`bun test`.quiet();
    return true;
  } catch {
    return false;
  }
}

/**
 * Create initial ATOM decision for setup
 * Uses timestamp-based unique suffix to avoid counter conflicts
 */
async function recordSetupAtom(): Promise<boolean> {
  try {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    // Use timestamp suffix for uniqueness (HHmmss format)
    const timeStr = now.toISOString().slice(11, 19).replace(/:/g, "");
    const tag = `ATOM-INIT-${dateStr}-${timeStr}-new-user-setup`;

    const decision = {
      atom_tag: tag,
      type: "INIT",
      description: "New user environment setup completed",
      files: ["package.json", "tsconfig.json", ".atom-trail/"],
      timestamp: now.toISOString(),
      freshness: "fresh",
    };

    const decisionPath = join(ATOM_TRAIL_DIR, "decisions", `${tag}.json`);
    await writeFile(decisionPath, JSON.stringify(decision, null, 2));

    return true;
  } catch {
    return false;
  }
}

/**
 * Main setup function
 */
async function setup(options: SetupOptions): Promise<SetupResult> {
  const result: SetupResult = {
    success: true,
    steps: [],
    timestamp: new Date().toISOString(),
  };

  console.log("\n🌀 SpiralSafe Auto-Setup\n");
  console.log("═".repeat(40));

  // Step 1: Check Bun version
  log("step", "Checking Bun installation...");
  const bunCheck = await checkBunVersion();
  result.steps.push({
    name: "bun_version",
    status: bunCheck.passed ? "passed" : "failed",
    message: `Bun version: ${bunCheck.version}`,
  });
  if (bunCheck.passed) {
    log("success", `Bun ${bunCheck.version} detected`);
  } else {
    log("error", "Bun 1.0.0+ required. Install from https://bun.sh");
    result.success = false;
    return result;
  }

  // Step 2: Check/Install dependencies
  log("step", "Checking dependencies...");
  const depsExist = checkDependencies();

  if (options.check) {
    result.steps.push({
      name: "dependencies",
      status: depsExist ? "passed" : "failed",
      message: depsExist ? "Dependencies installed" : "Dependencies missing",
    });
    if (!depsExist) {
      log("warn", "Dependencies not installed. Run without --check to install.");
    } else {
      log("success", "Dependencies found");
    }
  } else {
    const installed = await installDependencies(options.force || !depsExist);
    result.steps.push({
      name: "dependencies",
      status: installed ? "passed" : "failed",
      message: installed ? "Dependencies installed" : "Failed to install",
    });
    if (installed) {
      log("success", "Dependencies ready");
    } else {
      result.success = false;
    }
  }

  // Step 3: Setup ATOM trail
  log("step", "Setting up ATOM provenance trail...");
  if (options.check) {
    const atomExists = existsSync(ATOM_TRAIL_DIR);
    result.steps.push({
      name: "atom_trail",
      status: atomExists ? "passed" : "failed",
      message: atomExists ? "ATOM trail exists" : "ATOM trail missing",
    });
    if (atomExists) {
      log("success", "ATOM trail directory found");
    } else {
      log("warn", "ATOM trail not initialized");
    }
  } else {
    const atomSetup = await setupAtomTrail();
    result.steps.push({
      name: "atom_trail",
      status: atomSetup ? "passed" : "failed",
      message: atomSetup ? "ATOM trail configured" : "Failed to setup",
    });
    if (atomSetup) {
      log("success", "ATOM trail ready for provenance tracking");
    }
  }

  // Step 4: Verify TypeScript config
  log("step", "Verifying TypeScript configuration...");
  const tsConfig = checkTypeScriptConfig();
  result.steps.push({
    name: "typescript_config",
    status: tsConfig ? "passed" : "failed",
    message: tsConfig ? "tsconfig.json found" : "tsconfig.json missing",
  });
  if (tsConfig) {
    log("success", "TypeScript configured");
  } else {
    log("error", "TypeScript configuration missing");
    result.success = false;
  }

  // Step 5: Run tests (optional verification)
  if (!options.check) {
    log("step", "Running test suite...");
    const testsPass = await runTests();
    result.steps.push({
      name: "tests",
      status: testsPass ? "passed" : "failed",
      message: testsPass ? "All tests passed" : "Some tests failed",
    });
    if (testsPass) {
      log("success", "Test suite passing");
    } else {
      log("warn", "Some tests may be failing (check output)");
      result.success = false;
    }
  }

  // Step 6: Record setup in ATOM trail
  if (!options.check) {
    await recordSetupAtom();
    log("info", "Setup recorded in ATOM trail");
  }

  // Summary
  console.log("\n" + "═".repeat(40));
  const passedCount = result.steps.filter((s) => s.status === "passed").length;
  const totalCount = result.steps.length;

  if (result.success) {
    log("success", `Setup complete! (${passedCount}/${totalCount} checks passed)`);
    console.log("\n🚀 Quick Start Commands:");
    console.log("   bun run dev        - Start development servers");
    console.log("   bun test           - Run test suite");
    console.log("   bun run lint       - Check code style");
    console.log("   bun run scripts/atom-tag.ts INIT 'my task'  - Create ATOM tag\n");
  } else {
    log("error", `Setup incomplete (${passedCount}/${totalCount} checks passed)`);
    console.log("\n⚠️  Please resolve the issues above and re-run setup.\n");
  }

  return result;
}

// Main execution
if (import.meta.main) {
  const options = parseArgs();
  setup(options).catch(console.error);
}

export { setup, checkBunVersion, checkDependencies };

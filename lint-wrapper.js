const { ESLint } = require("eslint");

(async function main() {
  const args = process.argv.slice(2);
  const isFix = args.includes("--fix");

  const eslint = new ESLint({ fix: isFix });
  const targetPaths = args.filter(arg => !arg.startsWith("--"));
  const lintPaths = targetPaths.length > 0 ? targetPaths : ["."];

  const results = await eslint.lintFiles(lintPaths);
  if (isFix) {
      await ESLint.outputFixes(results);
  }

  const filesRead = results.length;

  if (filesRead === 0) {
    console.error("Lint failure: 0 files scanned (empty run).");
    process.exit(1);
  }

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = await formatter.format(results);

  const errorCount = results.reduce((acc, r) => acc + r.errorCount, 0);
  const warningCount = results.reduce((acc, r) => acc + r.warningCount, 0);

  if (errorCount > 0 || warningCount > 0) {
      console.log(resultText);
  }

  console.log(`Lint exit code: ${errorCount > 0 ? 1 : 0} (scanned ${filesRead} files)`);
  if (errorCount > 0) {
      process.exit(1);
  }
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

# Seorchable Agent Skills

Project-specific agent skills live under `skills/`.

## Load policy

- `AGENTS.md` is the persistent repository contract.
- A skill is a task-specific procedure. Load it when the task matches its scope.
- Do not treat a skill as permission to expand task scope or override `AGENTS.md`.
- For high-risk changes, load the relevant skill before the first edit.
- Skills must produce evidence: inspected files, executed checks, observed failures/successes, and residual risk.

## Available skills

- `repository-audit`: establish repository facts and architecture before changing code.
- `authentication`: audit and repair the complete authentication/session lifecycle.
- `database-migration`: design, implement, and verify safe schema migrations.
- `security-review`: review trust boundaries and security-sensitive changes.
- `test-verification`: prove that tests detect the intended defect and that the final change is actually verified.
- `bug-fix`: reproduce, isolate, fix, and regression-test a concrete defect.

Use only the skills relevant to the current task. Do not load every skill by default.

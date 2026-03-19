# Design Decisions & Alternatives

---

## Why concurrency groups to cancel stale runs?

Every push to a branch triggers a new CI run. Without concurrency groups, pushing
twice in quick succession runs both. The second run is always the relevant one;
the first wastes CI minutes.

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This cancels the older run for the same workflow + branch combination. On PRs
this means only the latest push is tested. On main it still allows concurrent
runs across different branches.

---

## Why one CI file per language instead of composable fragments?

Composable reusable workflows (`.github/workflows/reusable-setup.yml`) are
powerful but add indirection. For small-to-medium projects, one self-contained
`ci.yml` is easier to read, debug, and modify.

The templates are designed to be modified in place. Copy, customize, and own it.

---

## Why `fail-fast: false` in the matrix strategy?

With `fail-fast: true` (the default), if Node 18 fails, GitHub cancels the
Node 20 and 22 jobs. This can hide failures that are version-specific.

With `fail-fast: false`, all matrix jobs run to completion, giving a full picture
of which versions are affected.

---

## Why cache 'pip' using setup-python's built-in cache?

`actions/setup-python@v5` has built-in pip caching (`cache: 'pip'`) that
automatically caches based on requirements files. It avoids needing a separate
`actions/cache` step for most Python projects.

---

## Why `go-version-file: go.mod` for Go projects?

Specifying `go-version-file: go.mod` pins CI to the exact same Go version
declared in the module file — no drift between local and CI environments.

---

## Why `-race` flag in Go tests?

The `-race` flag enables Go's built-in race condition detector. It adds ~20%
overhead but catches concurrency bugs that are otherwise non-deterministic and
difficult to reproduce. In CI where correctness matters over speed, it's always
worth enabling.

---

## Why `cargo clippy -- -D warnings`?

`-D warnings` treats all clippy warnings as errors, ensuring the CI fails on
any lint issue. Without this, clippy warnings appear in logs but the job passes —
they accumulate and never get fixed.

---

## Why check format before running tests?

Format checks (`eslint`, `ruff format --check`, `cargo fmt --check`) are fast
and fail loudly. Placing them before tests means formatting issues surface
immediately without waiting for the full test suite.

---

## Why include a build step?

A build step catches compilation errors, broken imports, and bundling failures
that tests alone won't detect (especially in TypeScript/JSX projects where
test files might use loose types). For Go and Rust, `go build ./...` and
`cargo build` confirm the entire workspace compiles cleanly.

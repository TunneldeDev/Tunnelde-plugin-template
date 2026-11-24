# Developing a plugin

Follow [README](README.md). The template supplies pinned SDK dependencies, real stdio tests, deterministic ZIP packaging and independent immutable releases. Document minimum host versions, runtime consent, requested permissions and external data access. Hub distributes verified links only.

When maintaining this template, run `npm run verify:template`. CI initializes a separate plugin on Node 22/24, installs build dependencies, builds and tests it, checks repeatable packaging, and runs the verified ZIP without installed dependencies.

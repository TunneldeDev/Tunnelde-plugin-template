# Example Plugin

[English](README.en-us.md) · [简体中文](README.zh-cn.md)

A minimal standalone Tunnelde plugin maintained by YOUR_NAME. Replace this paragraph with installation, permissions and data-handling documentation before publishing. Repository: https://github.com/YOUR_OWNER/YOUR_REPOSITORY.

1. Select **Use this template** to create your own repository.
2. Run `npm ci --ignore-scripts`.
3. Run `npm run init -- my-plugin "My Plugin" my-account my-repository`.
4. Run `npm run build`, `npm run verify`, and `npm run package`. Before changing the template itself, also run `npm run verify:template`; CI checks a freshly initialized plugin and executes its verified ZIP without installed dependencies on Node 22 and 24.
5. Install `artifacts/<id>-<version>.zip` through Tunnelde's Plugins page.
6. Set the same version in package.json and tunnelde-plugin.json, commit, then push `vX.Y.Z`. The Release workflow publishes immutable ZIP, SHA256SUMS and marketplace.json assets independently.
7. Submit a Hub PR registering your repository and verified marketplace metadata under catalogue/. Hub maintainers review permissions and package identity; future versions are discovered through the Hub update PR workflow.

The starter requests no permissions. Runtime SDK code is bundled at build time; installation requires no npm or network. Declare additional permissions explicitly and document how user data is accessed. Write logs to stderr: stdout carries JSON-RPC.

For declarative themes, remove the backend entry and Node engine, set `runtime: "theme"`, contribute themes/icons/previews, and keep permissions empty. For other declarative views use the host's documented manifest contract. See the [SDK guide](https://github.com/TunneldeDev/Tunnelde-plugin-sdk/blob/main/sdk/README.md).

# tracker

An AI-native location tracking app.

## Overview

This project has two components.

- **mobile**: a mobile app built with React Native and Expo that broadcasts the
  users' location to the server.
- **web**: a Next.js app that stores user location and hosts an optional
  MCP server for the user to connect to.

## Self-hosting

Location data is very sensitive so this project is designed to be self-hosted.

To self-host the web app, I recommend setting up a Vercel project. Fill up your
`.env` file and deploy it with the Root Directory set to `web/`.

"Self-hosting" the app means you build your own version of it using Xcode, with
your own environment variables.

## Development

See the `README.md` files of the individual components.

## Status

[![Build Status](https://img.shields.io/github/actions/workflow/status/felipap/tracker/lint-mobile.yml?label=Mobile+Build)](https://github.com/felipap/tracker/actions)
[![Build Status](https://img.shields.io/github/actions/workflow/status/felipap/tracker/lint-web.yml?label=Web+Build&color=blue)](https://github.com/felipap/tracker/actions)

## License

MIT

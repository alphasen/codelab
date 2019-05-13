# codelab: a command-line http server and a light weight browser code editor

`codelab` is a simple, zero-configuration command-line http server.  It's very simple and hackable enough to be used for testing and local development.

# Installing globally:

Installation via `npm`:

     npm install codelab -g

This will install `codelab` globally so that it may be run from the command line.

## Running on-demand:

Using `npx` you can run the script without installing it first:

     npx codelab [path] [options]

## Usage:

     codelab [path] [options]

*Now you can visit http://localhost:3333 to view your server*

## Available Options:

`-p` or `--port` Port to use (defaults to `3333`)

`-a` Address to use (defaults to `0.0.0.0`)

`-s` or `--silent` Suppress log messages from output (defaults to `false`)

`--open` Open browser window after starting the server (defaults to `true`). e.g.: --open=false

`--log-ip` Enable logging of the client's IP address (default: `true`).

`--log-user-agent` Enable logging request's user-agent (default to `false`)

`-h` or `--help` Print this list and exit.

# Development

Checkout this repository locally, then:

```sh
$ npm i
$ node bin/codelab
```

*Now you can visit http://localhost:3333 to view your server*

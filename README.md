
<!--#echo json="package.json" key="name" underline="=" -->
botbase2610-pmb
===============
<!--/#echo -->

<!--#echo json="package.json" key="description" -->
Generic CLI bot skeleton with stuff like a command registry, randomized
delays, and a dispatch loop.
<!--/#echo -->



Module API
----------

This module exports an object with these properties and methods:

### bb.makeBotBlueprint()

Return a clean empty bot blueprint. See "Blueprint API" below.


### bb.expectEmptyCmdOptsAfterCmd(cmdOptsDict, cmdName)

If `cmdOptsDict` contains any enumerable own keys, assume they are unused
(and thus unsupported) command options given to bot command `cmdName`,
and throw an Error about that.




Blueprint API
-------------

The blueprint will have these properties and methods:


### bp.defaultConfig

The default config dictionary for new bot runs.
It's expected to be JSON-compatible.
See [`src/cfg.defaults.mjs`](src/cfg.defaults.mjs).


### bp.cmdOptWrapper(cmdOptsDict, cmdName, botRun)

A function that wraps command options before they are forwarded to your
command implementations.
The default is `null` which means options should not be wrapped.


### bp.cmdOptCheckUnused(cmdOptsDict, cmdName, botRun)

A function to check for unused (and thus probably unsupported)
command options left over after a command implementation has run.
Defaults to `bb.expectEmptyCmdOptsAfterCmd`.
If you don't need this check, you may set this to `null`.


### bp.learnCmd(name, impl)

Teach your bot a command `name` (string).
The `impl` is an async function that takes parameters `(botRun, cmdOpt)`
where `botRun` is the shared state of a bot run (see below) and `cmdOpt`
are the options for the command, potentially wrapped by `cmdOptWrapper`.


### async bp.run()

Start a new bot run. See "Bot Run API" below.



Bot Run API
-----------

A bot run is a plain object with these properties and methods:


### br.config

The config for this bot run.


### async br.cmd(cmdSpec)

Invoke a command. `cmdSpec` is expected to be a dictionary where key `cmd`
has the command name. All other entries are considered the command options.


### br.donePr

A `Promise` for completion of the bot run.



Usage
-----

See the implementation of
[`imap-presort26-pmb`](https://github.com/mk-pmb/imap-presort26-pmb),
starting from `cli.mjs`.



Known issues
------------

* Needs more/better tests and docs.





<!--#toc stop="scan" -->

&nbsp;


License
-------
<!--#echo json="package.json" key="license" -->
ISC
<!--/#echo -->

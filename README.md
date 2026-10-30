
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


### bb.makeMustPop(dict)

A shorthand for using the undocumented `mustBe` feature from `objpop`.


### bb.expectEmptyCmdOptsAfterCmd(popper)

Given the popper function returned from `bb.makeMustPop`,
if there are any left-over unused options,
complain (throw an Error) about them being unsupported, and that the
command implementation itself should have complained about them already.



Blueprint API
-------------

The blueprint will have these properties and methods:


### bp.defaultConfig

The default config dictionary for new bot runs.
See [`src/cfg.defaults.mjs`](src/cfg.defaults.mjs).


### bp.cmdOptWrapper(cmdOptsDict, botRun)

A function that wraps command options before they are forwarded to your
command implementations.
The default is `bb.makeMustPop`.
If you want your options dictionary as just a plain old object
(with no wrapper), set this to the `Object` global function
or to any object-compatible flavor of the identity function.


### bp.cmdOptCheckUnused(cmdOptsDict, botRun)

A function to check for unused (and thus probably unsupported)
command options left over after a command implementation has run.
Defaults to `bb.expectEmptyCmdOptsAfterCmd`.
If you don't need this check, set this to the `Boolean` global function
or any cheap do-nothing function.


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

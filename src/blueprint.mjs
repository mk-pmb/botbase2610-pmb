// -*- coding: utf-8, tab-width: 2 -*-

import mustBe from 'typechecks-pmb/must-be.js';
import objPop from 'objpop';
import pWhileUndef from 'p-while-undef';
import vTry from 'vtry';

import cmdDelayRanges from './cmdDelayRanges.mjs';
import cmdMainLoop from './cmdMainLoop.mjs';
import defaultConfig from './cfg.defaults.mjs';


const doNothing = Boolean;


function jsonDeepCopy(x) { return x && JSON.parse(JSON.stringify(x)); }


const EX = {

  makeBotBlueprint(customize) {
    const bp = {
      defaultConfig: jsonDeepCopy(defaultConfig),
      knownCommands: new Map(),

      ...EX.staticBluePrintApi,

      ...customize,
    };
    if (bp.cmdOptWrapper === 'mustPop') {
      bp.cmdOptWrapper = EX.makeMustPop;
      bp.cmdOptCheckUnused = EX.expectEmptyCmdOptsPopperAfterCmd;
    }
    return bp;
  },


  makeMustPop(dict) { return objPop(dict, { mustBe }).mustBe; },


  expectEmptyCmdOptsAfterCmd(cmdOptsDict, cmdName) {
    if (!cmdOptsDict) { return; }
    const unused = Object.keys(cmdOptsDict).sort().join(', ');
    if (!unused) { return; }
    const err = new Error(EX.voc.errLeftoverCmdOpts + cmdName + ': ' + unused);
    err.name = 'BotCmdLeftoverUnusedCmdOpts';
    err.cmdName = cmdName;
    err.getUnusedOptsDict = Object.bind(null, cmdOptsDict);
    throw err;
  },


  expectEmptyCmdOptsPopperAfterCmd(popper, cmdName) {
    popper.expectEmpty(EX.voc.errLeftoverCmdOpts + cmdName);
  },


  configure(botRun) {
    // eslint-disable-next-line no-param-reassign
    botRun.getCmdDelayRange = cmdDelayRanges.fromConfig(botRun.config.cmd);
  },


  async runNextCmdAndWait(botRun) {
    const q = botRun.cmdQueue;
    const cmdIdx = q.curIdx + 1;
    if (cmdIdx >= q.length) {
      botRun.ended = Date.now(); // eslint-disable-line no-param-reassign
      return botRun;
    }
    // ==BEGIN== imaginary critical section
    const curCmdSpec = q[cmdIdx];
    delete q[cmdIdx];
    q.curIdx = cmdIdx;
    // ==ENDOF== imaginary critical section
    await botRun.cmd(curCmdSpec);
    const cmdName = curCmdSpec.cmd;
    const delaySec = botRun.getCmdDelayRange.randomize(cmdName);
    await pDelay(delaySec * 1e3);
    return undefined;
  },


  async runWrappedCmd(bp, botRun, cmdImpl, origCmdOpt) {
    const wrappedOpt = await (bp.cmdOptWrapper || Object)(origCmdOpt, botRun);
    const result = await cmdImpl(botRun, wrappedOpt);
    await (bp.cmdOptCheckUnused || doNothing)(wrappedOpt, botRun);
    return result;
  },


};


EX.voc = {
  errLeftoverCmdOpts: 'Unused, probably unsupported, options for bot command ',
};



EX.staticBluePrintApi = {

  cmdOptCheckUnused: EX.expectEmptyCmdOptsAfterCmd,


  learnCmd(name, impl) {
    const bp = this;
    if (bp.knownCommands.has(name)) {
      const msg = 'This bot blueprint already has a command named ' + name;
      const err = new Error(msg);
      err.name = 'BotCmdNameAlreadyDefined';
      throw err;
    }
    bp.knownCommands.set(name, impl);
  },


  async run() {
    const bp = this;
    const startedAt = Date.now();
    const botRun = {
      ...EX.staticBotRunApi,
      cmdQueue: [],
      config: jsonDeepCopy(bp.defaultConfig),
      getBlueprint() { return bp; },
      startedAt,
    };
    EX.configure(botRun);
    botRun.cmdQueue.curIdx = -1;
    botRun.donePr = pWhileUndef(EX.runNextCmdAndWait, botRun);
    return botRun;
  },


};



EX.staticBotRunApi = {

  async cmd(cmdSpec) {
    const botRun = this;
    const { cmd: cmdName, ...origCmdOpt } = cmdSpec;
    mustBe.nest('command name', cmdName);
    const bp = botRun.getBlueprint();
    const cmdImpl = bp.knownCommands.get(cmdName);
    if (!cmdImpl) { throw new Error('Unsupported script command: ' + cmdName); }
    console.debug('botcmd:', { cmdName }, origCmdOpt, cmdImpl);
    const trace = ' script command ' + cmdName;
    mustBe.fun('Implementation for' + trace, cmdImpl);
    botRun.prevCmdResult = await vTry.pr(EX.runWrappedCmd,
      'While running' + trace)(bp, botRun, cmdImpl, origCmdOpt);
  },


};






// Object.assign(EX, {});
export default EX;

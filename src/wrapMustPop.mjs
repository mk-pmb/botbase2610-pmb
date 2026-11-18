// -*- coding: utf-8, tab-width: 2 -*-

import mustBe from 'typechecks-pmb/must-be.js';
import objPop from 'objpop';

import blueprint from './blueprint.mjs';

const { voc } = blueprint;

const EX = {
  makeMustPop(dict) { return objPop(dict, { mustBe }).mustBe; },

  expectEmptyCmdOptsAfterCmd(popper, cmdName) {
    popper.expectEmpty(voc.errLeftoverCmdOpts + cmdName);
  },

};


export default EX;

// -*- coding: utf-8, tab-width: 2 -*-

import deepFreeze from 'deep-freeze-es6';


const dfCfg = {

  cmd: {
    scripts: [],
    delayBase: { '*': '0 sec' },
    delayAddRandom: { '*': '0 sec' },
  },

};


deepFreeze(dfCfg);

export default dfCfg;

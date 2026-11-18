// -*- coding: utf-8, tab-width: 2 -*-
//
// All durations are in seconds.

import getOwn from 'getown';
import loMapValues from 'lodash.mapvalues';
import parseDura from 'timestring-notsep';
import vTry from 'vtry';


const EX = {

  fromConfig(cmdCfg) {
    const f = function getCmdDelayRange(cmdName) {
      const base = getOwn(f.base, cmdName, f.base['*']);
      const add = getOwn(f.add, cmdName, f.add['*']);
      return { base, add };
    };

    function parseEachCmdDelay(d, v, k) {
      return vTry(parseDura, 'parse duration config.cmd.' + d + '.' + k)(v);
    }

    function parseDurationsDict(dictKey) {
      const m = loMapValues(cmdCfg[dictKey],
        parseEachCmdDelay.bind(null, dictKey));
      return new Map(m);
    }

    Object.assign(f, {
      base: parseDurationsDict('delayBase'),
      add: parseDurationsDict('delayAddRandom'),
      randomize(cmdName) {
        const { base, add } = f(cmdName);
        const sec = base + (Math.random() * add);
        return sec;
      },
    });

    return f;
  },


};




export default EX;

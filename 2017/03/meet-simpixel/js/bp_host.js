'use strict';

/**'
 * @param {boolean} alwaysAsk whether to ask the user for a host even if they have provided one during a previous visit
 */
function bpHost(alwaysAsk) {
  var BP_HOST_DEFAULT = 'localhost:1337';
  return 'ws://' + BP_HOST_DEFAULT;
}
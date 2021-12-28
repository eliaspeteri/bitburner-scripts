/** @param {NS} ns **/
export async function main(ns) {
  const debug = false;

  const { exec, serverExists, tprint } = ns;

  // Start buying servers
  if (debug) tprint('Attempting to start /scripts/purchaseServers.js');
  exec('/scripts/purchaseServers.js', 'home', 1, 2048, false);

  // Start custom stats
  if (debug) tprint('Attempting to start /scripts/bitburner/custom_stats.js');
  exec('/scripts/bitburner/custom_stats.js', 'home');

  // (Re)start Hacknet server
  if (serverExists('hacknet')) {
    ns.killall('hacknet');
    await ns.scp('/scripts/hacknet.js', 'home', 'hacknet');
    if (debug) tprint('Attempting to start /scripts/hacknet.js');
    ns.exec('/scripts/hacknet.js', 'hacknet');
  }

  // Start main program that handles hacking and allocating servers
  if (debug) tprint('Attempting to start /scripts/run.js');
  exec('/scripts/run.js', 'home', 1, debug);
}

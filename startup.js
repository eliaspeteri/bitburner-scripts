/** @param {NS} ns **/
export async function main(ns) {
  const debug = false;

  const { exec, serverExists, tprint } = ns;

  if (debug) tprint('Attempting to start /scripts/purchaseServers.js');
  // Start buying servers
  exec('/scripts/purchaseServers.js', 'home', 1, 2048);

  if (debug) tprint('Attempting to start /scripts/bitburner/custom_stats.js');
  // Start custom stats
  exec('/scripts/bitburner/custom_stats.js', 'home');

  if (debug) tprint('Attempting to start /scripts/run.js');
  // Start main program that handles hacking and allocating servers
  exec('/scripts/run.js', 'home', 1, debug);

  // (Re)start Hacknet server
  if (serverExists('hacknet')) {
    ns.killall('hacknet');
    await ns.scp('/scripts/hacknet.js', 'home', 'hacknet');
    if (debug) tprint('Attempting to start /scripts/hacknet.js');
    ns.exec('/scripts/hacknet.js', 'hacknet');
  }
}

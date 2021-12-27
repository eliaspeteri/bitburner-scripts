/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog('sleep');
  ns.disableLog('getServerMoneyAvailable');

  var ram = 8;
  var index = 0;
  ns.args[0] ? (ram = ns.args[0]) : (ram = 8);
  if (ns.getPurchasedServers.length >= ns.getPurchasedServerLimit()) {
    ns.tprint('Max number of servers already purchased.');
  }
  while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
    if (ns.getServerMoneyAvailable('home') >= ns.getPurchasedServerCost(ram)) {
      ns.purchaseServer(`pserv-${index}`, ram);
      ns.print(
        `Purchased server pserv-${index} with ${ram}GB of RAM for \$${ns.getPurchasedServerCost(
          ram
        )}.`
      );
      index++;
    }

    await ns.sleep(1000);
  }
  ns.tprint('Finished buying servers.');
}

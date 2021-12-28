/** @param {NS} ns **/
export async function main(ns) {
  const {
    args,
    disableLog,
    getPurchasedServers,
    getPurchasedServerLimit,
    getServerMoneyAvailable,
    getPurchasedServerCost,
    print,
    purchaseServer,
    serverExists,
    sleep,
    tprint
  } = ns;

  const debug = args[1];

  if (!debug) {
    disableLog('sleep');
    disableLog('getServerMoneyAvailable');
  }

  let ram = 8;
  let hacknetBought = false;
  const numServers = 24;
  args[0] ? (ram = args[0]) : (ram = 8);
  if (getPurchasedServers().length >= getPurchasedServerLimit()) {
    tprint('Max number of servers already purchased.');
  }
  if (!serverExists('hacknet')) {
    purchaseServer('hacknet', 8);
    tprint('Purchased a server to run hacknet.');
    hacknetBought = true;
  } else {
    hacknetBought = true;
  }
  while (getPurchasedServers().length < getPurchasedServerLimit()) {
    if (debug) {
      print(`hacknetBought: ${hacknetBought}`);
      print(`server money: ${getServerMoneyAvailable('home')}`);
      print(`server cost: ${getPurchasedServerCost(ram) * numServers}`);
    }
    if (
      hacknetBought &&
      getServerMoneyAvailable('home') >=
        getPurchasedServerCost(ram) * numServers
    ) {
      for (let i = 0; i < numServers; i++) {
        purchaseServer(`pserv-${i}`, ram);
        print(
          `Purchased server pserv-${i} with ${ram}GB of RAM for \$${getPurchasedServerCost(
            ram
          )}.`
        );
      }
    }
    await sleep(1000);
  }
  tprint('Finished buying servers.');
}

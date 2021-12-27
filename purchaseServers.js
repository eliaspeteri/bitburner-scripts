/** @param {NS} ns **/
export async function main(ns) {
  const {
    args,
    disableLog,
    getPurchasedServers,
    getPurchasedServerLimit,
    getServerMoneyAvailable,
    getPurchasedServerCost,
    purchaseServer,
    sleep,
    tprint
  } = ns;

  disableLog('sleep');
  disableLog('getServerMoneyAvailable');

  var ram = 8;
  var index = 0;
  args[0] ? (ram = args[0]) : (ram = 8);
  if (getPurchasedServers.length >= getPurchasedServerLimit()) {
    tprint('Max number of servers already purchased.');
  }
  while (getPurchasedServers().length < getPurchasedServerLimit()) {
    if (getServerMoneyAvailable('home') >= getPurchasedServerCost(ram)) {
      purchaseServer(`pserv-${index}`, ram);
      print(
        `Purchased server pserv-${index} with ${ram}GB of RAM for \$${getPurchasedServerCost(
          ram
        )}.`
      );
      index++;
    }

    await sleep(1000);
  }
  tprint('Finished buying servers.');
}

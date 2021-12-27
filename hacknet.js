/** @param {NS} ns **/
export async function main(ns) {
  let maxNodes = 16;
  const maxLevel = 200;
  const maxRAM = 64;
  const maxCores = 16;

  /* returns the player's available funds */
  function myMoney() {
    return ns.getServerMoneyAvailable('home');
  }

  /* disabling the logs for some (method) functions */
  ns.disableLog('getServerMoneyAvailable');
  ns.disableLog('sleep');

  while (true) {
    /* attempt to level up hacknet nodes */
    for (var i = 0; i < ns.hacknet.numNodes(); i++) {
      while (ns.hacknet.getNodeStats(i).level < maxLevel) {
        var cost = ns.hacknet.getLevelUpgradeCost(i, 10);
        while (myMoney() < cost) {
          ns.print(`Need \$${cost} to level up. Have \$${myMoney()}.`);
          await ns.sleep(3000);
        }
        var res = ns.hacknet.upgradeLevel(i, 10);
      }
    }

    ns.print('All nodes upgraded to level 100.');

    /* attempt to upgrade RAM for all hacknet nodes */
    for (var i = 0; i < ns.hacknet.numNodes(); ++i) {
      while (ns.hacknet.getNodeStats(i).ram < maxRAM) {
        var cost = ns.hacknet.getRamUpgradeCost(i, 2);
        while (myMoney() < cost) {
          ns.print(`Need \$${cost} for RAM. Have \$${myMoney()}.`);
          await ns.sleep(3000);
        }
        var res = ns.hacknet.upgradeRam(i, 2);
      }
    }
    ns.print('All nodes upgraded to 64GB RAM.');

    /* attempt to upgrade CPUs for all hacknet nodes */
    for (var i = 0; i < ns.hacknet.numNodes(); ++i) {
      while (ns.hacknet.getNodeStats(i).cores < maxCores) {
        var cost = ns.hacknet.getCoreUpgradeCost(i, 1);
        while (myMoney() < cost) {
          ns.print(`Need \$${cost} for cores. Have \$${myMoney()}.`);
          await ns.sleep(3000);
        }
        var res = ns.hacknet.upgradeCore(i, 1);
      }
    }
    ns.print('All nodes upgraded to 16 cores.');

    /* purchase hacknet nodes */
    while (ns.hacknet.numNodes() < maxNodes) {
      var res = ns.hacknet.purchaseNode();
      ns.print(`Purchased hacknet Node with index ${res}.`);
      await ns.sleep(1000);
    }
    maxNodes++;
    await ns.sleep(1000);
  }
}

/* eslint-disable no-unused-vars */
/* eslint-disable no-constant-condition */
/** @param {NS} ns **/
export async function main(ns) {
  let maxNodes = 16;
  const maxLevel = 200;
  const maxRAM = 64;
  const maxCores = 16;

  const { disableLog, getServerMoneyAvailable, print, sleep } = ns;
  const {
    getCoreUpgradeCost,
    getLevelUpgradeCost,
    getNodeStats,
    getRamUpgradeCost,
    numNodes,
    purchaseNode,
    upgradeCore,
    upgradeLevel,
    upgradeRam
  } = ns.hacknet;
  /* returns the player's available funds */
  function myMoney() {
    return getServerMoneyAvailable('home');
  }

  /* disabling the logs for some (method) functions */
  disableLog('getServerMoneyAvailable');
  disableLog('sleep');

  while (true) {
    /* attempt to level up hacknet nodes */
    for (let i = 0; i < numNodes(); i++) {
      while (getNodeStats(i).level < maxLevel) {
        let cost = getLevelUpgradeCost(i, 10);
        while (myMoney() < cost) {
          print(`Need $${cost} to level up. Have $${myMoney()}.`);
          await sleep(3000);
        }
        let res = upgradeLevel(i, 10);
      }
    }

    ns.print('All nodes upgraded to level 100.');

    /* attempt to upgrade RAM for all hacknet nodes */
    for (let i = 0; i < numNodes(); ++i) {
      while (getNodeStats(i).ram < maxRAM) {
        let cost = getRamUpgradeCost(i, 2);
        while (myMoney() < cost) {
          print(`Need $${cost} for RAM. Have $${myMoney()}.`);
          await sleep(3000);
        }
        let res = upgradeRam(i, 2);
      }
    }
    print('All nodes upgraded to 64GB RAM.');

    /* attempt to upgrade CPUs for all hacknet nodes */
    for (let i = 0; i < numNodes(); ++i) {
      while (getNodeStats(i).cores < maxCores) {
        let cost = getCoreUpgradeCost(i, 1);
        while (myMoney() < cost) {
          print(`Need $${cost} for cores. Have $${myMoney()}.`);
          await sleep(3000);
        }
        let res = upgradeCore(i, 1);
      }
    }
    ns.print('All nodes upgraded to 16 cores.');

    /* purchase hacknet nodes */
    while (numNodes() < maxNodes) {
      let res = purchaseNode();
      print(`Purchased hacknet Node with index ${res}.`);
      await sleep(3000);
    }
    await sleep(1000);
  }
}

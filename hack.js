/* eslint-disable no-constant-condition */
/** @param {NS} ns **/
export async function main(ns) {
  const {
    args,
    getServerMaxMoney,
    getServerMinSecurityLevel,
    getServerMoneyAvailable,
    getServerSecurityLevel,
    grow,
    hack,
    sleep,
    weaken
  } = ns;
  // target server
  var target = args[0];

  while (true) {
    // if target's security level is greater than the target's minimum security level, weaken
    if (
      getServerSecurityLevel(target) >
      getServerMinSecurityLevel(target) + 5
    ) {
      await weaken(target);
    }
    // else if target's money level is less than 90 % of max money, grow
    else if (
      getServerMoneyAvailable(target) <
      getServerMaxMoney(target) * 0.9
    ) {
      await grow(target);
    }
    // else hack
    else {
      await hack(target);
    }
    await sleep(1000);
  }
}

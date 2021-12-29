/* eslint-disable no-constant-condition */
export async function main(ns) {
  ns.print("'foodnstuff' hacking initiated.");
  while (true) {
    await ns.hack('foodnstuff');
    await ns.grow('foodnstuff');
    await ns.weaken('foodnstuff');
    ns.print(ns.args);
    await ns.sleep(3000);
  }
}

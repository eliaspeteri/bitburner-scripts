export async function main(ns) {
  ns.print("'foodnstuff' hacking initiated.");
  while (true) {
    await ns.hack('foodnstuff');
    await ns.grow('foodnstuff');
    await ns.weaken('foodnstuff');
    ns.print(ns.args);
    ns.sleep(3000);
  }
}

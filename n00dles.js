export async function main(ns) {
  ns.print("'n00dles' hacking initiated.");
  while (true) {
    await ns.hack('n00dles');
    await ns.grow('n00dles');
    await ns.weaken('n00dles');
    ns.sleep(3000);
    ns.print(ns.args);
  }
}

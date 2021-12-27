/** @param {NS} ns **/
export async function main(ns) {
  ns.killall(ns.args[0]);
}

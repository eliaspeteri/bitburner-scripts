/** @param {NS} ns **/
export async function main(ns) {
  const { args, connect, installBackdoor } = ns;
  const target = args[0];
  connect(target);
  installBackdoor(target);
}

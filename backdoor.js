/** @param {NS} ns **/
export async function main(ns) {
  const { args, connect, installBackdoor } = ns;
  target = args[0];
  connect(target);
  installBackdoor(target);
}

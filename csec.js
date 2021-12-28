/** @param {NS} ns **/
export async function main(ns) {
  const { brutessh, fileExists, hasRootAccess, nuke, tprint } = ns;
  if (fileExists('brutessh.exe')) brutessh('CSEC');
  nuke('CSEC');
  if (hasRootAccess('CSEC'))
    tprint('Hacked into CSEC, please install backdoor.');
}

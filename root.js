/** @param {NS} ns **/
export async function main(ns) {
  const {
    args,
    brutessh,
    fileExists,
    ftpcrack,
    hasRootAccess,
    httpworm,
    nuke,
    relaysmtp,
    sqlinject,
    tprint,
    write
  } = ns;
  const serv = args[0];
  const debug = args[1];

  async function log(message) {
    await write('/logs/root.js.txt', message, 'a');
  }
  try {
    if (!hasRootAccess(serv)) {
      fileExists('brutessh.exe') ? brutessh(serv) : null;
      fileExists('ftpcrack.exe') ? ftpcrack(serv) : null;
      fileExists('relaysmtp.exe') ? relaysmtp(serv) : null;
      fileExists('httpworm.exe') ? httpworm(serv) : null;
      fileExists('sqlinject.exe') ? sqlinject(serv) : null;

      nuke(serv);

      if (hasRootAccess(serv)) {
        const debugMsg = `Hacked into ${serv}.`;
        tprint(debugMsg);
        log(`${new Date().toISOString()}: ${debugMsg}.`);
      } else if (debug) {
        tprint(
          `${serv}: Hacking level too small. Player hack level: ${ns.getHackingLevel()}. Required: ${ns.getServerRequiredHackingLevel(
            serv
          )}`
        );
      }
    } else if (debug) {
      tprint(`${serv}: Root access already.`);
    }
  } catch (error) {
    if (debug) tprint(String(error));
  }
}

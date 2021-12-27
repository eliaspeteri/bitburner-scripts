/** @param {NS} ns **/
export async function main(ns) {
  const debug = false;
  const hackingScript = '/scripts/hack.script';
  var target = 'max-hardware';
  var totalThreads = 0;

  const servers = [
    'home',
    'n00dles',
    'foodnstuff',
    'max-hardware',
    'sigma-cosmetics',
    'joesguns',
    'zer0',
    'neo-net',
    'crush-fitness',
    'rho-construction',
    'aerocorp',
    'global-pharm',
    'aevum-police',
    'hong-fang-tea',
    'CSEC',
    'phantasy',
    'comptek',
    'netlink',
    'rothman-uni',
    'harakiri-sushi',
    'nectar-net',
    'iron-gym',
    'silver-helix',
    'johnson-ortho',
    'I.I.I.I',
    'summit-uni',
    'alpha-ent',
    'snap-fitness',
    'omnia',
    'icarus',
    'taiyang-digital',
    'univ-energy',
    'infocomm',
    'deltaone',
    'syscore',
    'lexo-corp',
    'omega-net',
    'the-hub',
    'zb-institute',
    'millenium-fitness',
    'snap-fitness',
    'galactic-cyber',
    'unitalife',
    'defcomm',
    'solaris',
    'nova-med',
    'zeus-med',
    'zb-def',
    'avmnite-02h',
    'catalyst'
  ];

  // Start buying servers
  ns.exec('/scripts/purchaseServers.js', 'home', 1, 2048);

  // Start custom stats
  ns.exec('/scripts/bitburner/custom_stats.js', 'home');

  // Monitor the target
  // ns.exec("/scripts/bitburner/monitor.js", "home", 1, target)

  // calculates max threads available
  function calculateThreads(script, hostname) {
    const threads = Math.floor(
      (ns.getServerMaxRam(hostname) - ns.getServerUsedRam(hostname)) /
        ns.getScriptRam(script)
    );
    totalThreads += threads;
    return threads;
  }

  // calculates server with highest hacking level required, that the player has access to
  const playerHackingLevel = ns.getHackingLevel();
  const targetHackingLevel = ns.getHackingLevel(target);
  for (var i = 0; i < servers.length; i++) {
    const serverHackingLevel = ns.getServerRequiredHackingLevel(servers[i]);
    if (
      serverHackingLevel > targetHackingLevel &&
      playerHackingLevel >= serverHackingLevel &&
      ns.hasRootAccess(servers[i])
    ) {
      target = servers[i];
    }
  }
  ns.tprint(`Currently targeting ${target}.`);

  /* starts hacking scripts on the purchased servers using a random destination from the server list */
  for (var i = 0; i < ns.getPurchasedServers().length; i++) {
    const serv = ns.getPurchasedServers()[i];

    await ns.scp(hackingScript, 'home', serv);

    try {
      ns.exec(
        hackingScript,
        serv,
        calculateThreads(hackingScript, serv),
        target // target
      );
      totalThreads += calculateThreads(hackingScript, serv);
    } catch (error) {
      ns.tprint(String(error));
    }
  }

  /* goes through the list of hacked servers and starts the hacking script on them one by one */
  for (var i = 0; i < servers.length; i++) {
    const serv = servers[i];

    try {
      if (!ns.hasRootAccess(serv)) {
        ns.fileExists('brutessh.exe') ? ns.brutessh(serv) : null;
        ns.fileExists('ftpcrack.exe') ? ns.ftpcrack(serv) : null;
        ns.fileExists('relaysmtp.exe') ? ns.relaysmtp(serv) : null;
        ns.fileExists('httpworm.exe') ? ns.httpworm(serv) : null;
        ns.fileExists('sqlinject.exe') ? ns.sqlinject(serv) : null;

        ns.nuke(serv);

        if (ns.hasRootAccess(serv)) ns.tprint(`Hacked into ${serv}.`);
        else if (debug) {
          ns.tprint(
            `${serv}: Hacking level too small. Player hack level: ${ns.getHackingLevel()}. Required: ${ns.getServerRequiredHackingLevel(
              serv
            )}`
          );
        }
      } else if (debug) {
        ns.tprint(`${serv}: Root access already.`);
      }
      await ns.scp(hackingScript, 'home', serv);
    } catch (error) {
      if (debug) ns.tprint(String(error));
    }

    if (
      ns.getServerMaxRam(serv) - ns.getServerUsedRam(serv) > 0 &&
      ns.hasRootAccess(serv) &&
      ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(serv)
    ) {
      serv == 'home'
        ? ns.exec(
            hackingScript, // hacking script
            serv, // server to hack on
            calculateThreads(hackingScript, serv), // number of threads available
            target // target, normally just the host itself
          )
        : ns.exec(
            hackingScript, // hacking script
            serv, // server to hack on
            calculateThreads(hackingScript, serv), // number of threads available
            serv // target, normally just the host itself
          );
    }
  }

  ns.tprint(`Created ${totalThreads} new threads.`);

  // (Re)start Hacknet server
  // ns.killall("hacknet")
  // await ns.scp("/scripts/hacknet.js", "home", "hacknet")
  // ns.exec("/scripts/hacknet.js", "hacknet")
}

/** @param {NS} ns **/
export async function main(ns) {
  const debug = false;
  const hackingScript = '/scripts/hack.script';
  var target = 'the-hub';
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

  const {
    exec,
    getServerMaxRam,
    getServerUsedRam,
    getScriptRam,
    getHackingLevel,
    getServerRequiredHackingLevel,
    hasRootAccess,
    getPurchasedServers,
    fileExists,
    brutessh,
    ftpcrack,
    relaysmtp,
    httpworm,
    sqlinject,
    nuke,
    scp,
    tprint
  } = ns;

  // Start buying servers
  exec('/scripts/purchaseServers.js', 'home', 1, 2048);

  // Start custom stats
  exec('/scripts/bitburner/custom_stats.js', 'home');

  // Monitor the target
  if (!debug) exec('/scripts/bitburner/monitor.js', 'home', 1, target);

  // calculates max threads available
  function calculateThreads(script, hostname) {
    const threads = Math.floor(
      (getServerMaxRam(hostname) - getServerUsedRam(hostname)) /
        getScriptRam(script)
    );
    totalThreads += threads;
    return threads;
  }

  // calculates server with highest hacking level required, that the player has access to
  const playerHackingLevel = getHackingLevel();
  const targetHackingLevel = getHackingLevel(target);
  for (var i = 0; i < servers.length; i++) {
    const serverHackingLevel = getServerRequiredHackingLevel(servers[i]);
    if (
      serverHackingLevel > targetHackingLevel &&
      playerHackingLevel >= serverHackingLevel &&
      hasRootAccess(servers[i])
    ) {
      target = servers[i];
    }
  }
  tprint(`Currently targeting ${target}.`);

  /* starts hacking scripts on the purchased servers using a random destination from the server list */
  for (var i = 0; i < getPurchasedServers().length; i++) {
    const serv = getPurchasedServers()[i];

    await scp(hackingScript, 'home', serv);

    try {
      exec(
        hackingScript,
        serv,
        calculateThreads(hackingScript, serv),
        target // target
      );
      totalThreads += calculateThreads(hackingScript, serv);
    } catch (error) {
      tprint(String(error));
    }
  }

  /* goes through the list of hacked servers and starts the hacking script on them one by one */
  for (var i = 0; i < servers.length; i++) {
    const serv = servers[i];

    try {
      if (!hasRootAccess(serv)) {
        fileExists('brutessh.exe') ? brutessh(serv) : null;
        fileExists('ftpcrack.exe') ? ftpcrack(serv) : null;
        fileExists('relaysmtp.exe') ? relaysmtp(serv) : null;
        fileExists('httpworm.exe') ? httpworm(serv) : null;
        fileExists('sqlinject.exe') ? sqlinject(serv) : null;

        nuke(serv);

        if (hasRootAccess(serv)) tprint(`Hacked into ${serv}.`);
        else if (debug) {
          tprint(
            `${serv}: Hacking level too small. Player hack level: ${ns.getHackingLevel()}. Required: ${ns.getServerRequiredHackingLevel(
              serv
            )}`
          );
        }
      } else if (debug) {
        tprint(`${serv}: Root access already.`);
      }
      await scp(hackingScript, 'home', serv);
    } catch (error) {
      if (debug) tprint(String(error));
    }

    if (
      getServerMaxRam(serv) - getServerUsedRam(serv) > 0 &&
      hasRootAccess(serv) &&
      getHackingLevel() >= getServerRequiredHackingLevel(serv)
    ) {
      serv == 'home'
        ? exec(
            hackingScript, // hacking script
            serv, // server to hack on
            calculateThreads(hackingScript, serv), // number of threads available
            target // target, normally just the host itself
          )
        : exec(
            hackingScript, // hacking script
            serv, // server to hack on
            calculateThreads(hackingScript, serv), // number of threads available
            serv // target, normally just the host itself
          );
    }
  }

  tprint(`Created ${totalThreads} new threads.`);

  // (Re)start Hacknet server
  // ns.killall("hacknet")
  // await ns.scp("/scripts/hacknet.js", "home", "hacknet")
  // ns.exec("/scripts/hacknet.js", "hacknet")
}

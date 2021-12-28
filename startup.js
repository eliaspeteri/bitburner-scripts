/** @param {NS} ns **/
export async function main(ns) {
  const debug = true;
  const hackingScript = '/scripts/hack.script';
  var target = 'n00dles';
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
    getHackingLevel,
    getPurchasedServers,
    getServerMaxMoney,
    getServerMaxRam,
    getServerUsedRam,
    getScriptRam,
    getServerRequiredHackingLevel,
    hasRootAccess,
    scp,
    serverExists,
    tprint
  } = ns;

  // Start buying servers
  exec('/scripts/purchaseServers.js', 'home', 1, 2048);

  // Start custom stats
  exec('/scripts/bitburner/custom_stats.js', 'home');

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
  for (var i = 0; i < servers.length; i++) {
    const server = servers[i];
    const serverHackingLevel = getServerRequiredHackingLevel(server);
    if (
      serverHackingLevel > getServerRequiredHackingLevel(target) &&
      playerHackingLevel >= serverHackingLevel &&
      getServerMaxMoney(server) > getServerMaxMoney(target) &&
      hasRootAccess(server)
    ) {
      target = server;
    }
  }
  tprint(`Currently targeting ${target}.`);

  // Monitor the target
  if (!debug) exec('/scripts/bitburner/monitor.js', 'home', 1, target);

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
    } catch (error) {
      tprint(String(error));
    }
  }

  /* goes through the list of hacked servers and starts the hacking script on them one by one */
  for (var i = 0; i < servers.length; i++) {
    const serv = servers[i];
    exec('/scripts/root.js', 'home', 1, serv, debug);
    await scp(hackingScript, 'home', serv);

    if (
      getServerMaxRam(serv) - getServerUsedRam(serv) > 0 &&
      hasRootAccess(serv) &&
      getHackingLevel() >= getServerRequiredHackingLevel(serv)
    ) {
      exec(
        hackingScript, // hacking script
        serv, // server to hack on
        calculateThreads(hackingScript, serv), // number of threads available
        target // target, normally just the host itself
      );
    }
  }
  tprint(`Created ${totalThreads} new threads.`);

  // (Re)start Hacknet server
  if (serverExists('hacknet')) {
    ns.killall('hacknet');
    await ns.scp('/scripts/hacknet.js', 'home', 'hacknet');
    ns.exec('/scripts/hacknet.js', 'hacknet');
  }
}

/** @param {NS} ns **/
export async function main(ns) {
  const {
    args,
    exec,
    getHackingLevel,
    getPurchasedServers,
    getServerMaxMoney,
    getServerMaxRam,
    getServerUsedRam,
    getScriptRam,
    getServerRequiredHackingLevel,
    hasRootAccess,
    kill,
    killall,
    scp,
    sleep,
    tprint
  } = ns;

  const hackingScript = '/scripts/hack.script';
  const debug = args[0];
  var target = 'n00dles';
  var targetUpdated = false;
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
  ]; // servers

  // calculates max threads available
  function calculateThreads(script, hostname) {
    const [maxRam, usedRam, scriptRam] = [
      getServerMaxRam(hostname),
      getServerUsedRam(hostname),
      getScriptRam(script)
    ];
    const availableRam = maxRam - usedRam;
    if (debug) {
      tprint(`Calculating amount of threads for: ${hostname}`);
      tprint(`RAM available: ${availableRam}`);
      tprint(`Script RAM required: ${scriptRam}`);
    }
    const threads = Math.floor(availableRam / scriptRam);
    totalThreads += threads;
    return threads;
  } // calculateThreads()

  // executes the hacking script on a server
  function executeHack(server) {
    const threads = calculateThreads(hackingScript, server);
    if (debug) {
      tprint(`server: ${server}`);
      tprint(`threads: ${threads}`);
      tprint(`target: ${target}`);
    } // if-statement
    if (threads > 0) {
      exec(
        hackingScript,
        server,
        threads,
        target // target
      );
    } // if-statement
  } // executeHack()

  // main loop begins here
  while (true) {
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
        tprint(`Target updated: ${target} -> ${server}.`);
        target = server;
        tprint(`Currently targeting ${target}.`);
        targetUpdated = true;
      } // if-statement
    } // for-loop

    /* starts hacking scripts on the purchased servers using the target */
    for (var i = 0; i < getPurchasedServers().length; i++) {
      const serv = getPurchasedServers()[i];

      await scp(hackingScript, 'home', serv);

      try {
        executeHack(serv);
      } catch (error) {
        // try
        tprint(String(error));
        tprint(`server: ${serv}`);
      } // catch
    } // for-loop (purchased servers)

    /* goes through the list of hacked servers and starts the hacking script on them one by one */
    for (var i = 0; i < servers.length; i++) {
      const serv = servers[i];
      exec('/scripts/root.js', 'home', 1, serv, debug);
      await scp(hackingScript, 'home', serv);

      if (targetUpdated) {
        if (serv == 'home') {
          kill('/scripts/bitburner/monitor.js', 'home', target);
          exec('/scripts/bitburner/monitor.js', 'home', 1, target);
          executeHack(serv);
        } else {
          killall(serv);
          executeHack(serv);
        }
        tprint(`Spun up ${totalThreads} threads.`);
        targetUpdated = false;
      } // if-statement

      if (
        getServerMaxRam(serv) - getServerUsedRam(serv) > 0 &&
        hasRootAccess(serv) &&
        getHackingLevel() >= getServerRequiredHackingLevel(serv) &&
        serv != 'home'
      ) {
        try {
          killall(serv);
          executeHack(serv);
        } catch (error) {
          // try
          tprint(String(error));
          tprint(`server: ${serv}`);
        } // catch
      } // if-statement
    } // for-loop (hacked servers)
    await sleep(60000);
  } // while-loop
}

// Credit to lethern at Bitburner Discord for parts of the code

/** @param {NS} ns **/
export async function main(ns) {
  const {
    args,
    exec,
    getHackingLevel,
    getHostname,
    getPurchasedServers,
    getServerMaxMoney,
    getServerMaxRam,
    getServerUsedRam,
    getScriptRam,
    getServerRequiredHackingLevel,
    hasRootAccess,
    kill,
    killall,
    scan,
    scp,
    sleep,
    tprint
  } = ns;

  const host = getHostname();
  const hackingScript = '/scripts/hack.js';
  const debug = args[0];
  var target = 'n00dles';
  var targetUpdated = false;
  var totalThreads = 0;

  // Find neighboring servers
  function scanServers() {
    let serversFound = new Set();
    let origin = host;

    let stack = [];
    stack.push(origin);
    while (stack.length > 0) {
      let server = stack.pop();
      if (!serversFound.has(server)) {
        serversFound.add(server);
        let neighbors = scan(server);
        for (let neighbor of neighbors) {
          if (!serversFound.has(neighbor)) {
            stack.push(neighbor);
          } // if-statement
        } // for-of-loop
      } // if-statement
    } // while-loop
    return Array.from(serversFound);
  } // scanServers()

  // Create an array of all found servers
  const servers = scanServers();

  // calculates max threads available
  function calculateThreads(script, server) {
    const [maxRam, usedRam, scriptRam] = [
      getServerMaxRam(server),
      getServerUsedRam(server),
      getScriptRam(script)
    ];
    const availableRam = maxRam - usedRam;
    if (debug) {
      tprint(`Calculating amount of threads for: ${server}`);
      tprint(`RAM available: ${availableRam}`);
      tprint(`Script RAM required: ${scriptRam}`);
    } // if-statement
    const threads = Math.floor(availableRam / scriptRam);
    totalThreads += threads;
    return threads;
  } // calculateThreads()

  // executes the hacking script on a server
  function executeHack(server) {
    var threads = calculateThreads(hackingScript, server);

    // Leaving some memory free to run other programs
    if (server == host) threads -= 5;
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

      await scp(hackingScript, host, serv);

      try {
        executeHack(serv);
      } catch (error) {
        // try
        tprint(String(error));
        tprint(`server: ${serv}`);
      } // catch
    } // for-loop (purchased servers)

    /* goes through the list of hacked servers and starts the hacking script on them one by one */
    if (targetUpdated) {
      for (var i = 0; i < servers.length; i++) {
        const serv = servers[i];
        exec('/scripts/root.js', host, 1, serv, debug);
        await scp(hackingScript, host, serv);

        if (serv == host) {
          kill('/scripts/bitburner/monitor.js', 'home', target);
          exec('/scripts/bitburner/monitor.js', 'home', 1, target);
          executeHack(serv);
        } // if-statemente
        else {
          killall(serv);
          executeHack(serv);
        } // else-statemente
        targetUpdated = false;

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
      tprint(`Spun up ${totalThreads} threads.`);
    }
    await sleep(60000);
  } // while-loop
} // main(ns)

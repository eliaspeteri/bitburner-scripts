/* eslint-disable no-constant-condition */
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
    ps,
    scan,
    scp,
    sleep,
    tprint,
    write
  } = ns;

  const host = getHostname();
  const hackScript = '/scripts/hack.js';
  const debug = args[0];
  let target = 'n00dles';
  let targetUpdated = true;
  let totalThreads = 0;

  if (debug) {
    tprint('called /scripts/run.js');
  }

  async function log(message) {
    await write('/logs/run.js.txt', message, 'a');
  }

  function scanServers() {
    if (debug) {
      tprint('called scanServers');
    }
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
  }

  // Create an array of all found servers
  const servers = scanServers();

  // calculates max threads available
  async function calculateThreads(script, server) {
    const [maxRam, usedRam, scriptRam] = [
      getServerMaxRam(server),
      getServerUsedRam(server),
      getScriptRam(script)
    ];
    const availableRam = maxRam - usedRam;
    if (debug) {
      const debugMsg = `Calculating amount of threads for: ${server}\nRAM available: ${availableRam}\nScript RAM required: ${scriptRam}`;
      tprint(debugMsg);
      await log(debugMsg);
    } // if-statement
    const threads = Math.floor(availableRam / scriptRam);
    totalThreads += threads;
    return threads;
  } // calculateThreads()

  async function calculateTarget(server) {
    if (debug) {
      tprint('called calculateTarget');
    }
    const playerHackingLevel = getHackingLevel();
    const serverHackingLevel = getServerRequiredHackingLevel(server);
    if (
      serverHackingLevel > getServerRequiredHackingLevel(target) &&
      playerHackingLevel >= serverHackingLevel &&
      getServerMaxMoney(server) > getServerMaxMoney(target) &&
      hasRootAccess(server)
    ) {
      const targetUpdatedMsg = `${new Date().toISOString()}: Target updated: ${target} -> ${server}.`;
      tprint(targetUpdatedMsg);
      await log(targetUpdatedMsg);
      target = server;
      if (args[1]) target = args[1];
      const currentTargetMsg = `${new Date().toISOString()}: Currently targeting ${target}.`;
      tprint(currentTargetMsg);
      await log(currentTargetMsg);
      targetUpdated = true;
    } // if-statement
  } // calculateTarget()

  function gainRootAccess(server) {
    if (debug) {
      tprint('called gainRootAccess');
    }
    exec('/scripts/root.js', host, 1, server, debug);
  } // gainRootAccess()

  // executes the hacking script on a server
  async function executeHack(server) {
    let threads = await calculateThreads(hackScript, server);
    try {
      for (const process of ps(server)) {
        const pFilename = process.filename;
        const pid = process.pid;
        if (pFilename == 'hack.js') kill(pid);
      }
    } catch (error) {
      // try
      tprint(String(error));
    } // catch
    // Leaving some memory free on home to run other programs
    // if (server == host) threads -= 20;

    if (debug) {
      const debugMsg = `server: ${server}\nthreads: ${threads}\ntarget: ${target}`;
      tprint(debugMsg);
      await log(debugMsg);
    } // if-statement

    if (threads > 0) {
      exec(
        hackScript,
        server,
        threads,
        target // target
      );
    } // if-statement
  } // executeHack()

  // main loop begins here
  while (true) {
    // calculates server with highest hacking level required, that the player has access to
    for (const server of servers) {
      if (!hasRootAccess(server)) {
        gainRootAccess(server);
      }
      await calculateTarget(server);
    } // for-loop

    if (targetUpdated) {
      totalThreads = 0;
      /* starts hacking scripts using the target */
      for (const serv of [host, ...servers, ...getPurchasedServers()]) {
        gainRootAccess(serv);
        await scp(hackScript, host, serv);
        if (
          getServerMaxRam(serv) - getServerUsedRam(serv) > 0 &&
          hasRootAccess(serv) &&
          getHackingLevel() >= getServerRequiredHackingLevel(serv)
        )
          try {
            await executeHack(serv);
          } catch (error) {
            // try
            const debugMsg = `${new Date().toISOString()}: ${serv} returned an error: ${String(
              error
            )}`;
            tprint(debugMsg);
            await log(debugMsg);
          } // catch
      } // for-loop
      const debugMsg = `${new Date().toISOString()}: Spun up ${totalThreads} threads.`;
      tprint(debugMsg);
      await log(debugMsg);
    }
    targetUpdated = false;
    await sleep(30000);
  } // while-loop
} // main(ns)

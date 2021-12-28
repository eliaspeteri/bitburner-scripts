// Credit to lethern at Bitburner Discord for most of the code

/** @param {NS} ns **/
export async function main(ns) {
  const {
    fileExists,
    getGrowTime,
    getHackingLevel,
    getHostname,
    getServer,
    getServerMaxMoney,
    getServerNumPortsRequired,
    getServerRequiredHackingLevel,
    growthAnalyze,
    hackAnalyze,
    hackAnalyzeChance,
    scan,
    tprint
  } = ns;
  // Find neighboring servers
  function scanServers() {
    let serversFound = new Set();
    let origin = getHostname();

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
          }
        }
      }
    }
    return Array.from(serversFound);
  }

  // Create an array of all found servers
  const servers = scanServers();

  let serversProfit = [];
  // Add up the number of programs bought or created
  let tools = 0;
  [
    'BruteSSH.exe',
    'FTPCrack.exe',
    'relaySMTP.exe',
    'HTTPWorm.exe',
    'SQLInject.exe'
  ].forEach((t) => {
    if (fileExists(t)) tools++;
  });

  let cores = getServer('home').cpuCores;

  for (let server of servers) {
    if (
      getServerRequiredHackingLevel(server) > getHackingLevel() ||
      getServerNumPortsRequired(server) > tools
    ) {
      continue;
    }

    let money =
      hackAnalyzeChance(server) *
      hackAnalyze(server) *
      getServerMaxMoney(server);
    let gt = growthAnalyze(server, 1 / 0.5, cores);
    let profit = money / (getGrowTime(server) * gt);

    serversProfit.push({
      name: server,
      profit: profit * 1000
    });
  }

  serversProfit.sort((a, b) => b.profit - a.profit);

  let pad = servers.reduce((acc, elem) => Math.max(acc, elem.length), 0);
  for (let serv of serversProfit) {
    tprint(
      `Server: ${serv.name.padEnd(pad)} | Profit: ${(
        serv.profit.toFixed(3) + ''
      ).padEnd(10)}`
    );
  }
}

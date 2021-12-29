/** @param {NS} ns **/
export async function main(ns) {
  function scanServers() {
    let serversFound = new Set();
    let origin = ns.getHostname();
    let stack = [];

    stack.push(origin);
    while (stack.length > 0) {
      let server = stack.pop();
      if (!serversFound.has(server)) {
        serversFound.add(server);
        let neighbors = ns.scan(server);
        for (let neighbor of neighbors) {
          if (!serversFound.has(neighbor)) {
            stack.push(neighbor);
          } // if-statement
        } // for-of-loop
      } // if-statement
    } // while-loop
    return Array.from(serversFound);
  }

  const servers = scanServers();
  servers.sort((a, b) => ns.getHackTime(a) - ns.getHackTime(b));
  for (const server of servers) {
    const moneyAvailable = ns.getServerMoneyAvailable(server);
    ns.print(
      `===Currently hacking ${server} for $${moneyAvailable} / $${ns.getServerMaxMoney(
        server
      )}.===`
    );
    while (moneyAvailable > 0.0 && server != 'home') {
      ns.print(`moneyAvailable: ${moneyAvailable}`);
      ns.print(`securityLevel: ${ns.getServerSecurityLevel(server)}`);
      ns.getServerSecurityLevel(server) > ns.getServerMinSecurityLevel(server)
        ? await ns.weaken(server)
        : await ns.hack(server);
      await ns.sleep(500);
    }
  }
}

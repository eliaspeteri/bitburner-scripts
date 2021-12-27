/** @param {NS} ns **/
export async function main(ns) {
  var servers = [];
  // if a server is given in the arguments, and it's found, delete it, else delete all purchased servers
  ns.args[0] ? (servers = ns.args[0]) : (servers = ns.getPurchasedServers());

  for (var i = 0; i < servers.length; i++) {
    const server = servers[i];
    ns.killall(server);
    if (ns.deleteServer(server)) {
      ns.tprint(`Deleted server ${server}.`);
    }
  }
}

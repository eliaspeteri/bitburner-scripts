/** @param {NS} ns **/
export async function main(ns) {
  var servers = [];

  const { args, deleteServer, getPurchasedServers, killall, tprint } = ns;
  // if a server is given in the arguments, and it's found, delete it, else delete all purchased servers
  args[0] ? (servers = args[0]) : (servers = getPurchasedServers());

  for (var i = 0; i < servers.length; i++) {
    const server = servers[i];
    killall(server);
    if (deleteServer(server)) {
      tprint(`Deleted server ${server}.`);
    }
  }
}

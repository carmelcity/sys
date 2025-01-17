import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const proxyModule = buildModule("CarmelCollectionProxyModule", (m) => {
    const username = m.getParameter("username", "")
    const registryAddress = m.getParameter("registryAddress", "")
    const tokenAddress = m.getParameter("tokenAddress", "")
    const collectionId = m.getParameter("collectionId", "")
    const defaultHash0 = m.getParameter("defaultHash0", "")
    const defaultHash1 = m.getParameter("defaultHash1", "")
    const name = m.getParameter("name", "")
    const symbol = m.getParameter("symbol", "")
    const supply = m.getParameter("supply", "")
    const price = m.getParameter("price", "")
    const batch = m.getParameter("batch", "")

    const proxyAdminOwner = m.getAccount(0);
    const ctr = m.contract("CarmelCollection");
    const initialize = m.encodeFunctionCall(ctr, 'initialize', [ 
        username,
        registryAddress,
        tokenAddress,
        collectionId,
        defaultHash0,
        defaultHash1,
        name,
        symbol,
        supply,
        price,
        batch
   ]);

  const proxy = m.contract("TransparentUpgradeableProxy", [ctr, proxyAdminOwner, initialize]);
  const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin");
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});

const mainModule = buildModule("CarmelCollectionModule", (m) => {
    const { proxy, proxyAdmin } = m.useModule(proxyModule);
    const contract = m.contractAt("CarmelCollection", proxy);
  
    return { contract, proxy, proxyAdmin};
});

export default mainModule;
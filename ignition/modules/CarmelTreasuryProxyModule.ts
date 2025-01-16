import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const proxyModule = buildModule("CarmelTreasuryProxyModule", (m) => {
  const { CARMEL_REGISTRY_ADDR } = process.env
  const registryAddress = CARMEL_REGISTRY_ADDR || m.getParameter("registryAddress", "")

  const proxyAdminOwner = m.getAccount(0);
  const ctr = m.contract("CarmelTreasury");
  const initialize = m.encodeFunctionCall(ctr, 'initialize', [ proxyAdminOwner, registryAddress ]);

  const proxy = m.contract("TransparentUpgradeableProxy", [ctr, proxyAdminOwner, initialize ]);
  const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin");
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});

const mainModule = buildModule("CarmelTreasuryModule", (m) => {
  const { proxy, proxyAdmin } = m.useModule(proxyModule);
  const contract = m.contractAt("CarmelTreasury", proxy);

  return { contract, proxy, proxyAdmin };
});

export default mainModule;

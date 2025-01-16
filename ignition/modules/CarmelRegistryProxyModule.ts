import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const proxyModule = buildModule("CarmelRegistryProxyModule", (m) => {
  const { CARMEL_VERIFIER_ADDR } = process.env
  const verifierAddress = CARMEL_VERIFIER_ADDR || m.getParameter("verifierAddress", "")

  const proxyAdminOwner = m.getAccount(0);
  const ctr = m.contract("CarmelRegistry");
  const initialize = m.encodeFunctionCall(ctr, 'initialize', [ proxyAdminOwner, verifierAddress ]);
  const proxy = m.contract("TransparentUpgradeableProxy", [ctr, proxyAdminOwner, initialize]);
  const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin");
  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  return { proxyAdmin, proxy };
});

const mainModule = buildModule("CarmelRegistryModule", (m) => {
    const { proxy, proxyAdmin } = m.useModule(proxyModule);
    const contract = m.contractAt("CarmelRegistry", proxy);
  
    return { contract, proxy, proxyAdmin};
});

export default mainModule;
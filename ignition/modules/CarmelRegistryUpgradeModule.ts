import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ProxyModule from './CarmelRegistryProxyModule'

const upgradeModule = buildModule("CarmelRegistryUpgradeModule", (m) => {
  const proxyAdminOwner = m.getAccount(0);
  const { proxyAdmin, proxy } = m.useModule(ProxyModule)
  const ctr = m.contract("CarmelRegistryV2");

  m.call(proxyAdmin, "upgradeAndCall", [proxy, ctr, "0x"], { from: proxyAdminOwner });

  return { proxyAdmin, proxy };
});

const mainModule = buildModule("CarmelRegistryV2Module", (m) => {
  const { proxy } = m.useModule(upgradeModule);
  const contract = m.contractAt("CarmelRegistryV2", proxy);

  return { contract, proxy };
});

export default mainModule;

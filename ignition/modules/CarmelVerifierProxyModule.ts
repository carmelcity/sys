import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const proxyModule = buildModule("CarmelVerifierProxyModule", (m) => {
    const proxyAdminOwner = m.getAccount(0);
    const ctr = m.contract("CarmelVerifier");
    const initialize = m.encodeFunctionCall(ctr, 'initialize', [ proxyAdminOwner ]);
    const proxy = m.contract("TransparentUpgradeableProxy", [ctr, proxyAdminOwner, initialize ]);
    const proxyAdminAddress = m.readEventArgument(proxy, "AdminChanged", "newAdmin");
    const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

    return { proxyAdmin, proxy };
})

const mainModule = buildModule("CarmelVerifierModule", (m) => {
  const { proxy, proxyAdmin } = m.useModule(proxyModule);
  const contract = m.contractAt("CarmelVerifier", proxy);

  return { contract, proxy, proxyAdmin };
});

export default mainModule;

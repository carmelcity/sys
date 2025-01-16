import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ignition-ethers"
import "@nomicfoundation/hardhat-verify";
import "@typechain/hardhat"
import "hardhat-gas-reporter"
import "solidity-coverage"
import "hardhat-abi-exporter"
import '@openzeppelin/hardhat-upgrades'
import 'hardhat-contract-sizer'
import 'solidity-coverage'
import * as dotenv from "dotenv"
import { HardhatUserConfig, task } from "hardhat/config"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  contractSizer: {
    alphaSort: true,
    disambiguatePaths: false,
    runOnCompile: true,
    strict: true,
  },
  abiExporter: {
    path: './abi',
    clear: true,
    flat: false,
    runOnCompile: true,
    spacing: 2
  },
  networks: {
    hardhat: {
      gasPrice: 1500000000,
      gas: 4100000,
      accounts: [
        {
          privateKey: process.env.ETH_LOCAL_PRIVATE_KEY!, 
          balance: "1000000000000000000",
        },
        {
          privateKey: process.env.ETH_LOCAL2_PRIVATE_KEY!, 
          balance: "1000000000000000000",
        }
      ]
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || "",
      accounts: [process.env.ETH_DEVADMIN_PRIVATE_KEY!],
    }, 
    eth: {
      gas: 8000000,
      url: process.env.ETH_URL || "",
      accounts: [process.env.ETH_DEVADMIN_PRIVATE_KEY!]
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
}

export default config
import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers"

import "./tasks/compilelink";

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    'scroll-sepolia-testnet': {
      url: 'https://sepolia-rpc.scroll.io'
    },
  },
  etherscan: {
    apiKey: {
      'scroll-sepolia-testnet': 'empty'
    },
    customChains: [
      {
        network: "scroll-sepolia-testnet",
        chainId: 534351,
        urls: {
          apiURL: "https://scroll-sepolia.blockscout.com/api",
          browserURL: "https://scroll-sepolia.blockscout.com"
        }
      }
    ]
  }
};
export default config
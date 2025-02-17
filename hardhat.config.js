require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

// Ensure PRIVATE_KEY is loaded
const { PRIVATE_KEY } = process.env;

if (!PRIVATE_KEY) {
  console.error("❌ PRIVATE_KEY is missing in the .env file!");
  process.exit(1); // Stop execution if no private key
} else {
  console.log("✅ Loaded Private Key");
}

module.exports = {
  solidity: "0.8.11",
  defaultNetwork: "volta",
  networks: {
    hardhat: {},
    volta: {
      url: "https://volta-rpc.energyweb.org",
      accounts: [`0x${PRIVATE_KEY.trim()}`],  // Correctly using PRIVATE_KEY
      chainId: 73799,
    },
  },
};

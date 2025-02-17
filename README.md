# Decentralized Voting App

A decentralized voting system built using **Solidity** and **Hardhat** for secure and transparent voting. The contract prevents duplicate voting, allows the owner to add candidates, and enforces a voting deadline.

## Tech Stack

- **Solidity**: Smart contract development
- **Hardhat**: Development & testing framework
- **Ethers.js**: Contract interaction
- **Chai**: Unit testing
- **Dotenv**: Environment variables management

## Features

- Secure voting (one vote per user)
- Owner-only candidate management
- Voting deadline enforcement

## Setup and Installation

1. **Initialize the Project**:
   ```bash
   npm init -y
2. **Install Hardhat**: Installs Hardhat as a development dependency, enabling smart contract development and testing.
   ```bash
   npm install --save-dev hardhat
3. **Initialize Hardhat Project**: Sets up a new Hardhat project by creating necessary configuration files and directories.
   ```bash
   npx hardhat
4. **Compile Smart Contracts**: Compiles the smart contracts in the contracts directory, generating artifacts in the artifacts folder.
   ```bash
   npx hardhat compile
5. **Deploy smart-contract**: Deploys the compiled contracts to the Volta test network using the specified deployment script.
   ```bash
   npx hardhat run --network volta scripts/deploy.js
**Testing ::**
5. **Start a Local Hardhat Node**: Starts a local Ethereum network for testing and development purposes.
   ```bash
   npx hardhat node
   npx hardhat test --network hardhat

const { ethers } = require("hardhat"); // Explicitly import ethers

async function main() {
    console.log("🚀 Deploying contract...");

    const Voting = await ethers.getContractFactory("Voting");
    console.log("✅ Contract factory created.");

    // Deploy contract
    const Voting_ = await Voting.deploy(["Ramesh", "Sunny", "Ghanshaym", "Kishan"], 90);
    console.log("⏳ Waiting for contract deployment...");

    await Voting_.waitForDeployment(); // ✅ This replaces .deployed()

    console.log("🎉 Contract deployed at:", await Voting_.getAddress()); // ✅ New way to get the address
}

main()
   .then(() => process.exit(0))
   .catch(error => {
     console.error("❌ Deployment failed:", error);
     process.exit(1);
   });

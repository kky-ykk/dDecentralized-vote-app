const { expect } = require("chai");
const { ethers, network } = require("hardhat");

describe("Voting Contract", function () {
  let voting, owner, addr1, addr2, addr3;
  let candidates;
  let votingDuration = 10; // 10 minutes

  beforeEach(async function () {
    await network.provider.send("hardhat_reset"); // Reset blockchain

    [owner, addr1, addr2, addr3] = await ethers.getSigners();
    candidates = ["Alice", "Bob", "Charlie"];

    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy(candidates, votingDuration);
    await voting.waitForDeployment(); // Ensure deployment is complete
  });

  it("Should initialize candidates correctly", async function () {
    const allCandidates = await voting.getAllVotesOfCandiates(); // Correct function name

    expect(allCandidates.length).to.equal(3);
    expect(allCandidates[0].name).to.equal("Alice");
    expect(allCandidates[1].name).to.equal("Bob");
    expect(allCandidates[2].name).to.equal("Charlie");
  });

  it("Should allow a user to vote and update the vote count", async function () {
    await voting.connect(addr1).vote(0); // addr1 votes for Alice
    const allCandidates = await voting.getAllVotesOfCandiates();

    expect(allCandidates[0].voteCount.toString()).to.equal("1"); // Convert BigNumber to string
  });

  it("Should not allow a user to vote twice", async function () {
    await voting.connect(addr1).vote(0); // First vote
    await expect(voting.connect(addr1).vote(1)) // Second vote should fail
      .to.be.revertedWith("You have already voted.");
  });

  it("Should not allow voting for an invalid candidate index", async function () {
    await expect(voting.connect(addr1).vote(5)) // Index 5 does not exist
      .to.be.revertedWith("Invalid candidate index.");
  });

  it("Should correctly report voting status", async function () {
    expect(await voting.getVotingStatus()).to.equal(true);
  });

  it("Should return the correct remaining time", async function () {
    const remainingTime = await voting.getRemainingTime();
    expect(remainingTime).to.be.gt(0); // Use `.gt(0)` instead of `.greaterThan(0)`
  });

  it("Only owner should be able to add a new candidate", async function () {
    await voting.addCandidate("David");
    const allCandidates = await voting.getAllVotesOfCandiates();

    expect(allCandidates.length).to.equal(4);
    expect(allCandidates[3].name).to.equal("David");
  });

  // it("Non-owner should not be able to add a candidate", async function () {
  //   await expect(voting.connect(addr1).addCandidate("Eve"))
  //     .to.be.revertedWith("Ownable: caller is not the owner");
  // });

  it("Non-owner should not be able to add a candidate", async function () {
    await expect(voting.connect(addr1).addCandidate("Eve"))
        .to.be.revertedWith("Caller is not the owner"); // Update message here
});

});

const { expect } = require("chai");

describe("ReputationContract", function () {
    it("Updates reputation correctly", async function () {
        const [owner] = await ethers.getSigners();

        const Contract = await ethers.getContractFactory("ReputationContract");
        const contract = await Contract.deploy();
        await contract.waitForDeployment();

        await contract.updateReputation("hash1", false);
        expect(await contract.getReputation(owner.address)).to.equal(1);

        await contract.updateReputation("hash2", true);
        expect(await contract.getReputation(owner.address)).to.equal(0);
    });
});

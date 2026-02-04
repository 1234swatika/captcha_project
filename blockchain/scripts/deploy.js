async function main() {
    const Contract = await ethers.getContractFactory("ReputationContract");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();

    console.log(
        "ReputationContract deployed to:",
        await contract.getAddress()
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

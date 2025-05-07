async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployed with the account:", deployer.address);

  const HelloWorld = await hre.ethers.getContractFactory("helloWorld");
  const hello = await HelloWorld.deploy();

  await hello.deployed();
  console.log("Contrat deployed à :", hello.address);

	const greeting = await hello.greeting();
  console.log("Message send by balance(): ", hello.balances(hello.address));
  console.log("Message send by reeting(): ", greeting);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


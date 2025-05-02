async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Déploiement avec le compte :", deployer.address);

  const HelloWorld = await hre.ethers.getContractFactory("helloWorld");
  const hello = await HelloWorld.deploy();

  await hello.deployed();
  console.log("Contrat déployé à :", hello.address);

	const greeting = await hello.greeting();
  console.log("Message renvoyé par balance() :", hello.balances(hello.address));
  console.log("Message renvoyé par reeting() :", greeting);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });


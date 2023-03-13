const { ethers } = require("hardhat");
const hre = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  //setup account and variables
  const [deployer] = await ethers.getSigners()
  const NAME = "Dappcord"
  const SYMBOL = "DC"



  //deployment code here

  const Dappcord = await ethers.getContractFactory("Dappcord")
  const dappcord = await Dappcord.deploy(NAME,SYMBOL)
  await dappcord.deployed()

  console.log(`deployed at : ${dappcord.address}\n`)
  
  //create 3 channels using loop
  const CHANNEL_NAMES = ["General", "Intro", "Updates"]
  const COSTS = [tokens(1), tokens(0), tokens(0.25)]

  for (var i=0; i<3; i++){
    const transaction = await dappcord.connect(deployer).createChannel(CHANNEL_NAMES[i], COSTS[i])
    await transaction.wait()

    console.log(`Channel created #${CHANNEL_NAMES[i]}`)
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
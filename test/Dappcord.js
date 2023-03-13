const { expect } = require("chai")
const { ethers } = require("hardhat")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappcord", function () {

  let dappcord
  let deployer, user
  const NAME = "Dappcord"
  const SYMBOL = "DC"
  beforeEach(async () => {
    //accounts setup
    [deployer, user] = await ethers.getSigners()
    
    

    //deploy contract
    const Dappcord = await ethers.getContractFactory("Dappcord")
    dappcord = await Dappcord.deploy(NAME, SYMBOL)

    //create channel
    const transaction = await dappcord.connect(deployer).createChannel("general", tokens(1))
    await transaction.wait()
   
  })

  describe("Channels", function(){
    it("sets name", async() =>{
    
      let result = await dappcord.name()
      expect(result).to.equal(NAME)

    })
    it("sets name", async() =>{
 
      let result = await dappcord.symbol()
      expect(result).to.equal(SYMBOL)
    })
    it("sets owner", async() =>{
      const result = await dappcord.owner()
      expect(result).to.equal(deployer.address)
    })
    
  })

  describe("Deployment", function(){
    it('returns total channel', async() =>{
      const result = await dappcord.totalChannels()
      expect(result).to.be.equal(1)
    })
    it('returns channel attributes', async() => {
      const channel = await dappcord.getChannel(1)
      expect(channel.id).to.be.equal(1)
      expect(channel.name).to.be.equal("general")
      expect(channel.cost).to.be.equal(tokens(1))
    })
  })
  describe("Joining the channel", function(){
    ID = 1;
    const AMOUNT = ethers.utils.parseUnits('1', 'ether')

    beforeEach(async () =>{
      const transaction = await dappcord.connect(user).mint(ID, {value: AMOUNT})
      await transaction.wait()
    })
    it('joins user', async () => {
      const result = await dappcord.hasJoined(ID, user.address)
      expect(result).to.be.equal(true)
    })
    it('increases total supply', async () => {
      const result = await dappcord.totalSupply()
      expect(result).to.be.equal(ID)
    })
    it('updates contract ballance', async () => {
      let result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.be.equal(AMOUNT)
    })
  })
  describe("Withdraw function", function(){
    const ID = 1;
    const AMOUNT = ethers.utils.parseUnits("10", "ether")
    let balanceBefore

    beforeEach(async() => {
      balanceBefore = await ethers.provider.getBalance(deployer.address)

      let transaction = await dappcord.connect(user).mint(ID, {value: AMOUNT})
      await transaction.wait()
      
      transaction = await dappcord.connect(deployer).withdraw()
      await transaction.wait()
    })
    it('Updates balance', async() => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address)
      expect(balanceAfter).to.be.greaterThan(balanceBefore)
    })
    it('Updates contract balance', async() => {
      const result = await ethers.provider.getBalance(dappcord.address)
      expect(result).to.be.equal(0)
    })

  })

})

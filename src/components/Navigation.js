import { ethers } from 'ethers'

const Navigation = ({ account, setAccount }) => {

  const connectHandler = async() => {
    console.log("Clicked...")
    console.log("Loading...")
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'})
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)
    console.log("Account address is", account)
  }

  return (
    <nav>
      <div className='nav__brand'>
        <h1>Dappcord</h1>
      </div>

      {account ? (
        //button1
        <button 
            type='button' 
            className='nav__connect'
            >
              {account.slice(0,6)+'...'+account.slice(38,42)}
            </button>
      ) : (
        //button2
              
          <button 
            type='button' 
            className='nav__connect'
            onClick={connectHandler}
            >
              Connect
            </button>
      )}


    </nav>
  );
}

export default Navigation;
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { io } from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Dappcord.json'

// Config
import config from './config.json';

// Socket
const socket = io('ws://localhost:3030');

function App() {

  const [account,setAccount] = useState(null)
  const [provider,setProvider] = useState(null)
  const [dappcord,setDappcord] = useState(null)
  const [channels, setChannels] = useState([])
  const [currentChannel, setCurrentChannel] =useState(null)
  const [messages, setMessages] = useState([])

 


  const loadBlockchainData = async () =>{
      

      //connect provider
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      console.log("provider setted")

      //cotract connection

        //get network
      const network = await provider.getNetwork()
      
      const dappcord = new ethers.Contract(config[network.chainId].Dappcord.address,Dappcord,provider)
      
      setDappcord(dappcord)
     
      

      //contract inteaction

      const totalChannels = await dappcord.totalChannels()
      const countChannel = parseInt(totalChannels)
      console.log(countChannel  ) //wegot total channels
      const channels = []
      
      


      for (var i = 1; i <= totalChannels; i++) {
        const channel = await dappcord.getChannel(i)
        console.log("1")
        channels.push(channel)
      }
  
      setChannels(channels)
      console.log(channels)
      
      
      

      //Reload on changing acc
      window.ethereum.on('accountsChanged', async () => {
        window.location.reload()
  
        console.log("........")

    })

  }
  useEffect(() => {
    loadBlockchainData()


    socket.on("connection", () =>{
      socket.emit('get messages')
    })


    socket.on("new message", (messages) =>{
      setMessages(messages)
    })

    socket.on("get messages", (messages) =>{
      setMessages(messages)
    })

    return () =>{
      socket.off('connection')
      socket.off('new message')
      socket.off('get messages')
    }
  },[])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>

      <main>

      <Servers />
      <Channels 
        provider={provider}
        account={account}
        dappcord={dappcord}
        channels={channels}
        currentChannel={currentChannel}
        setCurrentChannel={setCurrentChannel}
      />
      <Messages account={account} messages={messages} currentChannel={currentChannel}/>

      </main>
    </div>
  );
}

export default App;

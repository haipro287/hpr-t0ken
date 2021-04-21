const { ethers } = require('ethers')
const fs = require('fs')
// const network = 'https://rinkeby.infura.io/v3/c2dc5f016978440a9b7233c5b8d0a4c5'
const projectId = 'c2dc5f016978440a9b7233c5b8d0a4c5'
const address = '0x0E556F5258130E5C8649aB0c2cA3F523aF8776F2'
const projectSecret = '1ae34e1ff5a140829dafbfbbc0be116c'
// const provider = new ethers.providers.InfuraProvider(network, projectId)
const options = {
    projectId,
    projectSecret
};
// console.log(options);
<<<<<<< HEAD

const PROVIDER = new ethers.providers.InfuraProvider('rinkeby', {
    projectId : INFURA_ID,
    projectSecret : INFURA_SECRET
})
const ABI = JSON.parse(fs.readFileSync('abi.json'))

=======
>>>>>>> 92f400828189e25788917054146e05f03c5c679c
const provider = new ethers.providers.InfuraProvider('rinkeby', options)

// const abi = JSON.parse(fs.readFileSync('abi.json'))

// const contract = new ethers.Contract(address, abi.abi, provider)
const wallet = ethers.Wallet.createRandom().connect(provider)
<<<<<<< HEAD

c
// console.log(wallet)

 provider.getBlockNumber().then(t =>{
    console.log(t )
 });
=======
console.log(wallet)

//  provider.getBlockNumber().then(t =>{
//     console.log(t )
//  });
>>>>>>> 92f400828189e25788917054146e05f03c5c679c



// contract.connect(signer)
// console.log(contract.address)
// const new_contract = contract.attach(address)
// console.log(wallet.provider)
// console.log(wallet.signMessage(JSON.stringify({name:'Vu'})))

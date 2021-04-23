
const { INFURA_ID, CONTRACT_ADDRESS, INFURA_SECRET } = process.env
const { AbiCoder } = require('@ethersproject/abi')
// const abiDecoder = require('abi-decoder')
const { ethers, BigNumber } = require('ethers')
const fs = require('fs')
const { PromiseProvider } = require('mongoose')
const { EncryptUsingSymmetricKey } = require('./crypto-utils')


const PROVIDER = new ethers.providers.InfuraProvider('rinkeby', {
    projectId: INFURA_ID,
    projectSecret: INFURA_SECRET
})
const ABI = JSON.parse(fs.readFileSync('abi.json')).abi
const CONTRACT = new ethers.Contract(CONTRACT_ADDRESS, ABI)
const INTERFACE = CONTRACT.interface
// abiDecoder.addABI(ABI.abi)

const abiCoder = new ethers.utils.AbiCoder(ABI.abi)

const createWallet = (password = 'temp') => {
    const wallet = ethers.Wallet.createRandom().connect(PROVIDER)
    return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        encryptedPrivateKey: EncryptUsingSymmetricKey(password, wallet.privateKey)
    }
}

const createWalletFromPrivateKey = (privateKey, password = 'temp') => {
    const wallet = new ethers.Wallet(privateKey).connect(PROVIDER)
    return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        encryptedPrivateKey: EncryptUsingSymmetricKey(password, wallet.privateKey)
    }
}
const createWalletFromMnemonic = (mnemonic, password = 'temp') => {
    const wallet = new ethers.Wallet.fromMnemonic(mnemonic).connect(PROVIDER)
    return {
        address: wallet.address,
        publicKey: wallet.publicKey,
        privateKey: wallet.privateKey,
        encryptedPrivateKey: EncryptUsingSymmetricKey(password, wallet.privateKey)
    }
}
const createContract = (privateKey) => {
    const wallet = new ethers.Wallet(privateKey).connect(PROVIDER)
    const contract = CONTRACT.connect(wallet)
    return contract
}

const getBalance = async (address) => {
    try {
        const wallet = createWallet()
        const contract = createContract(wallet.privateKey)
        const balance = await contract.balanceOf(address)
        // const balance = await PROVIDER.getBalance(address)
        return BigNumber.from(balance).div(BigNumber.from("1000000000000000000")).toString()
    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }


}

const transferMoney = async (privateKey, transferTo, amount = 1) => {
    try {
        const contract = createContract(privateKey)
        const isSuccess = await contract.transfer(transferTo, BigNumber.from(amount).mul(BigNumber.from("1000000000000000000")))
        // console.log({to, value, data, chainId, from, hash, nonce})
        const decodedData = abiDecoder.decodeMethod(isSuccess.data)
        console.log(decodedData)
        return isSuccess
    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }
}

const mintMoney = async (privateKey, amount = 1) => {
    try {
        const contract = createContract(privateKey)
        const isSuccess = await contract.mint(BigNumber.from(amount).mul(BigNumber.from("1000000000000000000")))
        const decodedData = abiDecoder.decodeMethod(isSuccess.data)
        console.log(decodedData)
        return isSuccess
    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }

}

const getETHBalance = async (privateKey) => {
    try {
        const wallet = new ethers.Wallet(privateKey).connect(PROVIDER)
        const balance = await wallet.getBalance()
        return BigNumber.from(balance).div(BigNumber.from("1000000000000000000")).toString()
    } catch (err) {
        console.log(err)
        throw new Error(err.message)
    }
}


const handleTransaction = ({event, args, transactionHash}) => {
    try {
        var {from, to, value} = args
        if (value) value = BigNumber.from(value).div(BigNumber.from("1000000000000000000")).toString()
        return {transactionHash, event, from, to, value}
    } catch (err) {
        throw new Error(err.message)
    }

}
const logTransactions = async (address = undefined) => {
    try {
        const logs = await CONTRACT.connect(PROVIDER).queryFilter(['Transfer(address,address,uint256)', 'Approval(address,address,uint256)'])
        if (!logs) throw new Error('LOG_FAIL')
        if (address) {
            return logs.map(log => handleTransaction(log)).filter(log => (address === log.from || address === log.to))
        }
        return logs.map(log => handleTransaction(log))
    } catch (err) {
        console.log(err)    
        throw new Error(err.message)
    }
}
module.exports = {
    createWallet, createWalletFromPrivateKey, createWalletFromMnemonic,
    getBalance, transferMoney, mintMoney, getETHBalance,
    logTransactions
}

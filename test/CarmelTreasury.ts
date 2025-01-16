import "@nomicfoundation/hardhat-ignition";
import hre from 'hardhat'
import { expect } from "chai";
import { parseEther } from 'ethers'
import CarmelRegistry from '../ignition/modules/CarmelRegistryProxyModule'
import CarmelVerifier from '../ignition/modules/CarmelVerifierProxyModule'
import CarmelTreasury from '../ignition/modules/CarmelTreasuryProxyModule'
import { b32enc, makeDigestSignature, makeKey} from '../src/utils'

const USERNAME = "user"
const GROUP = "users"
const ADDRESS = "0xc0ffee254729296a45a3885639AC7E10F9d54979"

const clientDataJSONBase64 = 'eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiNGtOSkNLT3V1ZExQUVR1Y1B6UHJJNHFwWTVuekdzMklNMjZHTTZid2IzSzMwU3Z3WkxPb3dpR080cVk0a3BxNVlJZEVZQ1hzTFFVSjY5RmVyNjNNLTNUYUxGd1RrWHFaRURYWlhNM0hadFRnRUZGWFdqdFA0SEZHN05uN3paZHdZZ2labV9POHJ4emQ4R1ZORVQtVkZfbjlKazBTVkJYV1FSVlJ0RnJqVmFvIiwib3JpZ2luIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwIiwiY3Jvc3NPcmlnaW4iOmZhbHNlfQ'      
const authenticatorDataBase64 = 'SZYN5YgOjGh0NBcPZHZgW4/krrmihjLHmVzzuoMdl2MdAAAAAA=='
const r = '0xa64e349d969d596edc2137ffa9314e353638182df082df92adf27afcf1db5ff6'
const s = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3429'
const s2 = '0xedb5f2a3ec4950cf545815f4cedd04f992290ca529d056241e2aee42c7aa3420'
const publicKeyBase64 = ['3cjXLJigSRcmgyCIQtTiaTIWfnmwsRLua8RcR0H5iHQ', 'oUKIrUiayLUvEM8sQZPC5jGRiNIVsCkyQDonb0pbMAo']

const xy = makeKey(publicKeyBase64)
const { digest, signature } = makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s)
const fingerprint = [0, b32enc(USERNAME), digest, signature]
const { signature: signature2 } = makeDigestSignature(authenticatorDataBase64, clientDataJSONBase64, r, s2)
const fingerprintError = [0, b32enc(USERNAME), digest, signature2]

describe("CarmelTreasury", function () {
  let treasury: any
  let signers: any 
  let registry: any

  beforeEach(async function () {
    signers = await hre.ethers.getSigners();

    const verifier = await hre.ignition.deploy(CarmelVerifier);
    const verifierAddress = await verifier.contract.getAddress()

    registry = await hre.ignition.deploy(CarmelRegistry, {
        parameters: {
          CarmelRegistryProxyModule: {
            verifierAddress
          }
        }
    })

    const registryAddress = await registry.contract.getAddress()

    treasury = await hre.ignition.deploy(CarmelTreasury,{
      parameters: {
        CarmelTreasuryProxyModule: {
          registryAddress
        }
      }
    })
  })

  describe("Deposits", () => {
    it("should be able to receive a deposit", async function () {
      const value = parseEther("0.01")
      const balance0Before = await hre.ethers.provider.getBalance(signers[0].address);

      await treasury.contract.deposit(b32enc(USERNAME), { value })
      expect(await treasury.contract.getBalance(b32enc(USERNAME))).to.be.equal(value)

      const balance0After = await hre.ethers.provider.getBalance(signers[0].address);
      expect(balance0After - balance0Before).to.be.lessThanOrEqual(value)
    })
  })

  describe("Withdrawals", () => {
    it("should be able to make a withdrawal", async function () {
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

      const value = parseEther("0.01")
      const value2 = parseEther("0.005")

      const balanceBefore = await hre.ethers.provider.getBalance(signers[1].address);

      await treasury.contract.deposit(b32enc(USERNAME), { value })
      await treasury.contract.withdraw(signers[1].address, value2, fingerprint)

      const balanceAfter = await hre.ethers.provider.getBalance(signers[1].address);
      expect(balanceAfter - balanceBefore).to.equal(value2)
    })

    it("should not be able to make a zero withdrawal", async function () {      
      await expect(treasury.contract.withdraw(signers[1].address, 0, fingerprint)).to.be.revertedWithCustomError(treasury.contract, "CarmelErrorCannotWithdrawZeroAmount");    
    })

    it("should not make a withdrawal for a non existent user", async function () {
      await expect(treasury.contract.withdraw(signers[1].address, 1, fingerprint)).to.be.revertedWithCustomError(treasury.contract, "CarmelErrorAccountDoesNotExist");    
    })

    it("should not make a withdrawal for an unauthorized user", async function () {
      const value = parseEther("0.01")
      const value2 = parseEther("0.005")

      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])
      await treasury.contract.deposit(b32enc(USERNAME), { value })

      await expect(treasury.contract.withdraw(signers[1].address, value2, fingerprintError)).to.be.revertedWithCustomError(treasury.contract, "CarmelErrorUnauthorizedAccount");    
    })

    it("should not be able to make a withdrawal with insufficient funds", async function () {      
      await registry.contract.register(b32enc(USERNAME), b32enc(GROUP), ADDRESS,  xy[0], xy[1])

      await expect(treasury.contract.withdraw(signers[1].address, 1, fingerprint)).to.be.revertedWithCustomError(treasury.contract, "CarmelErrorCannotWithdrawInsufficientFunds");    
    })
  })

   describe("Maintenance", () => {    
      it("should handle invalid initialization attempts", async function () {
        await expect(treasury.contract.initialize(ADDRESS, ADDRESS)).to.be.revertedWithCustomError(treasury.contract, "InvalidInitialization")
      })
   })  
})
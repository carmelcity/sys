import hre from "hardhat";
import bs58 from 'bs58'

const { ethers } = hre;
const { getBytes, keccak256, sha256, solidityPacked, concat } = ethers;

export const b32enc = (s: string) => ethers.encodeBytes32String(s)
export const b32dec = (s: string) => ethers.decodeBytes32String(s)
export const toUtf8Bytes = ethers.toUtf8Bytes
export const b32idec = (s: string) => parseInt(s)
export const b32ienc = (n: any) => {
    const hex = BigInt(n).toString(16)
    return `0x${'0'.repeat(64 - hex.length)}${hex}`
}

export async function run(driver: any) {
    await driver.catch((error: any) => {
        process.exitCode = 1;
    }) 
}

export const bytes32ToHash = (hash: any) => {
    return b32dec(hash[0]) + b32dec(hash[1])
}

export const accountHashesDecoded = (acct: any) => {
    return {
        umeta: b32dec(acct.umeta0) + b32dec(acct.umeta1),
        sysmeta: b32dec(acct.sysmeta0) + b32dec(acct.sysmeta1)
    }
}

export const hashToBytes32 = (hash: string) => {
    const part0 = hash.substring(0, 31)
    const part1 = hash.substring(31)

    return [b32enc(part0), b32enc(part1)]
}

export const challengeToBytes32 = (hash: string) => {
    const part0 = hash.substring(0, 31)
    const part1 = hash.substring(31, 62)
    const part2 = hash.substring(63)

    return [b32enc(part0), b32enc(part1), b32enc(part2)]
}

export const hashToHex = (hash: string) => "0x" + Buffer.from(bs58.decode(hash).slice(2)).toString('hex')
export const hexToHash = (hex: string) => bs58.encode(Buffer.from("1220" + hex.slice(2), 'hex'))
export const userHash = async (u: string) => "0x" + Buffer.from(await crypto.subtle.digest("SHA-256", Buffer.from(u))).toString('hex')

export const makeKey = (publicKeyBase64: string[]) => {
    const x = `0x${Buffer.from(publicKeyBase64[0], 'base64').toString('hex')}`
    const y = `0x${Buffer.from(publicKeyBase64[1], 'base64').toString('hex')}`

    return [x, y]
}

export const makeKeyData = (authenticatorDataBase64: string, clientDataJSONBase64: string) => {
    return ["0x" + Buffer.from(authenticatorDataBase64, 'base64').toString('hex'), Buffer.from(clientDataJSONBase64, 'base64').toString()]
}

export const makeDigestSignature = (authenticatorDataBase64: string, clientDataJSONBase64: string, r: string, s: string) => {
    const authenticatorDataBytes = Buffer.from(authenticatorDataBase64, 'base64')
    const clientDataJSONBytes = Buffer.from(clientDataJSONBase64, 'base64')
    const clientDataJSONHash = sha256(clientDataJSONBytes)
    const combinedData = solidityPacked(["bytes", "bytes"], [authenticatorDataBytes, clientDataJSONHash])
    const digest = sha256(combinedData)
    const signature = concat([getBytes(r), getBytes(s)])

    return { digest, signature }
}
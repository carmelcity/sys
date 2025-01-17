 /***********************************************************************************************************\
 *   ______     ___      .______      .___  ___.  _______  __          ______  __  .___________.____    ____ *
 *  /      |   /   \     |   _  \     |   \/   | |   ____||  |        /      ||  | |           |\   \  /   / *
 * |  ,----'  /  ^  \    |  |_)  |    |  \  /  | |  |__   |  |       |  ,----'|  | `---|  |----` \   \/   /  *
 * |  |      /  /_\  \   |      /     |  |\/|  | |   __|  |  |       |  |     |  |     |  |       \_    _/   *
 * |  `----./  _____  \  |  |\  \----.|  |  |  | |  |____ |  `----.__|  `----.|  |     |  |         |  |     *
 *  \______/__/     \__\ | _| `._____||__|  |__| |_______||_______(__)\______||__|     |__|         |__|     *
 *                                                                                                           *
 *  Copyright (C) 2025 - I. Dan Calinescu                                                                    *
 *  License: This code is licensed under MIT License (see LICENSE for details)                               *
 *                                                                                                           *
 *  CarmelRegistry.sol                                                                                        *  
 *                                                                                                           *                                                                                                       *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./CarmelBase.sol";

interface ICarmelVerifier {
    function verify(bytes32 digest, bytes calldata signature, bytes32 x, bytes32 y) external view returns (bool);
}

/// @title The Carmel Registry
/// @author I. Dan Calinescu
/// @notice This keeps track of all Carmel Accounts and associated data such as public keys
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract CarmelRegistry is Initializable, CarmelBase {

    /// @dev The Carmel Verifier used to verify signatures
    ICarmelVerifier private _verifier;

    /// @notice The total accounts available in this registry
    uint256 private _total_accounts;

    /// @dev Keep track of the main owner of this registry
    address private _owner;

    /// @dev Keep track of account public keys
    mapping(bytes32 => bytes32[]) private _keys_x;
    mapping(bytes32 => bytes32[]) private _keys_y;

    /// @dev Store account IPFS hashes
    mapping(bytes32 => bytes32[]) private _hashes;

    /// @dev A list of all registered Carmel Accounts
    mapping(bytes32 => CarmelAccount) private _accounts;

    /// @dev Index usernames by group
    mapping(bytes32 => bytes32[]) private _usernames;

    /// @dev A list of all tracked address for each account, by username
    mapping(bytes32 => address[]) private _addresses;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /// @dev called only once at deployment
    function initialize(
        address sender,
        address ver
    ) initializer public {
        _perms[sender] = ADMIN_PERM;
        _owner = sender;
        _verifier = ICarmelVerifier(ver);
    }

    /************************************************************************\
    *                     _    _               _                             *
    *   ___   ___  _ __  | |_ (_) _ __    ___ | |   __ _  _ __  ___   __ _   *
    *  / __| / _ \| '_ \ | __|| || '_ \  / _ \| |  / _` || '__|/ _ \ / _` |  *
    *  \__ \|  __/| | | || |_ | || | | ||  __/| | | (_| || |  |  __/| (_| |  *
    *  |___/ \___||_| |_| \__||_||_| |_| \___||_|  \__,_||_|   \___| \__,_|  *
    \************************************************************************/

    /// @notice Register a brand new Carmel account into this registry
    /// @param username The Carmel username (must be unique)
    /// @param grp The Carmel group to which this username will be added (ex: "users")
    /// @param addr The address associated with this account
    /// @param x The x coordinate of the key
    /// @param y The y coordinate of the key
    function register (bytes32 username, bytes32 grp, address addr, bytes32 x, bytes32 y) public requireSentinel returns (uint256) {
        CarmelAccount memory account = _accounts[username];
        if(account.username > bytes32(0)) revert CarmelErrorAccountAlreadyExists();
        
        uint256 accountId = _total_accounts;
        _total_accounts = _total_accounts + 1;
        _keys_x[username].push(x);
        _keys_y[username].push(y);
        _accounts[username].total_keys = 1;

        _hashes[username].push(bytes32(0));
        _hashes[username].push(bytes32(0));
        _hashes[username].push(bytes32(0));
        _hashes[username].push(bytes32(0));

        CarmelAccount memory acct = CarmelAccount({ id: accountId, group: grp, username: username, total_keys: 0, total_addresses:1 });
        _accounts[username] = acct;
        _addresses[username].push(addr);
        _usernames[grp].push(username);

        return accountId;
    }
   
    /// @notice Update an account's system hash
    /// @param username The account username
    /// @param m0 The first part of the hash
    /// @param m1 The second part of the hash
    function updateSystemHash (bytes32 username,  bytes32 m0, bytes32 m1) public requireSentinel {
        CarmelAccount memory account = _accounts[username];
        if(account.username == bytes32(0)) revert CarmelErrorAccountDoesNotExist();
    
        _hashes[username][0] = m0;
        _hashes[username][1] = m1;
    }

    /*******************************************************************************\
    *                                            _                                  *
    *       __ _   ___  ___  ___   _   _  _ __  | |_    __ _  _ __  ___   __ _      *
    *      / _` | / __|/ __|/ _ \ | | | || '_ \ | __|  / _` || '__|/ _ \ / _` |     *
    *     | (_| || (__| (__| (_) || |_| || | | || |_  | (_| || |  |  __/| (_| |     *
    *      \__,_| \___|\___|\___/  \__,_||_| |_| \__|  \__,_||_|   \___| \__,_|     *
    \*******************************************************************************/

    /// @notice
    function accountGetKeys (CarmelFingerprint calldata fingerprint) public view returns (bytes32[] memory, bytes32[] memory) {
        CarmelAccount memory account = _accounts[fingerprint.username];
        if(!verifyFingerprint(account, fingerprint)) revert CarmelErrorUnauthorizedAccount();
       
        return  (_keys_x[fingerprint.username], _keys_y[fingerprint.username]);
    }

    /// @notice 
    function accountAddAddress(address addr, CarmelFingerprint calldata fingerprint) public requireSentinel {
        CarmelAccount memory account = _accounts[fingerprint.username];
        if(!verifyFingerprint(account, fingerprint)) revert CarmelErrorUnauthorizedAccount();
        
        _addresses[fingerprint.username].push(addr);
        _accounts[fingerprint.username].total_addresses = account.total_addresses + 1;
    }

    /// @notice Add a new public key associated with an account
    /// @param x The x coordinate of the key
    /// @param y The y coordinate of the key
    /// @param fingerprint The account fingerprint
    function accountAddKey (bytes32 x, bytes32 y, CarmelFingerprint calldata fingerprint) public requireSentinel {
        CarmelAccount memory account = _accounts[fingerprint.username];
        if(!verifyFingerprint(account, fingerprint)) revert CarmelErrorUnauthorizedAccount();
        
        _keys_x[fingerprint.username].push(x);
        _keys_y[fingerprint.username].push(y);
        _accounts[fingerprint.username].total_keys = account.total_keys + 1;
    }

    /// @notice Update an account's personal hash
    /// @param m0 The first part of the hash
    /// @param m1 The second part of the hash
    /// @param fingerprint The account fingerprint
    function accountUpdateHash (bytes32 m0, bytes32 m1, CarmelFingerprint calldata fingerprint) public requireSentinel {
        CarmelAccount memory account = _accounts[fingerprint.username];
        if(!verifyFingerprint(account, fingerprint)) revert CarmelErrorUnauthorizedAccount();

        _hashes[fingerprint.username][2] = m0;
        _hashes[fingerprint.username][3] = m1;
    }

    /*********************************************************************\
    *                    _      _  _                                      *
    *      _ __   _   _ | |__  | |(_)  ___    __ _  _ __  ___   __ _      *
    *     | '_ \ | | | || '_ \ | || | / __|  / _` || '__|/ _ \ / _` |     *
    *     | |_) || |_| || |_) || || || (__  | (_| || |  |  __/| (_| |     *
    *     | .__/  \__,_||_.__/ |_||_| \___|  \__,_||_|   \___| \__,_|     *
    *     |_|                                                             *
    \*********************************************************************/

    /// @notice
    function getAddresses(bytes32 username) public view returns (address[] memory) {
        CarmelAccount memory account = _accounts[username];
        if(account.username == bytes32(0)) revert CarmelErrorAccountDoesNotExist();
        
        return _addresses[username];
    }

    /// @notice Verify a fingerprint
    /// @param fingerprint The account fingerprint
    /// @return True if the fingerprint is valid, false otherwise
    function verify (CarmelFingerprint calldata fingerprint) public view returns(bool) {
        CarmelAccount memory account = _accounts[fingerprint.username];
        return verifyFingerprint(account, fingerprint);
    }
    
    /// @notice
    function version() public pure returns (uint256) {
        return 1;
    }

    /// @notice
    function getPerms (address addr) public view returns (uint256) {
        return _perms[addr];
    }

    /// @notice
    function getAccount (bytes32 username) public view returns (CarmelAccount memory) {
        CarmelAccount memory account = _accounts[username];
        return account;
    }

    /// @notice 
    function getTotalAccounts() public view returns (uint256) {
        return _total_accounts;
    }

    /// @notice
    function getAccountHashes(bytes32 username) public view returns (bytes32[] memory) {
        return _hashes[username];
    }

    /// @notice Get a list of all accounts within a particular group
    /// @param grp The group to look up
    /// @return All the accounts within the group
    function getAccounts(bytes32 grp) public view returns (CarmelAccount[] memory) {
        bytes32[] memory all = _usernames[grp];
        uint total = all.length;
        CarmelAccount[] memory accts = new CarmelAccount[](total);

        for(uint i = 0; i < total; i++) {
            accts[i] = _accounts[all[i]];
        }

        return accts;
    }

    /// @notice Verify a fingerprint
    /// @param account The owner account
    /// @param fingerprint The account fingerprint
    /// @return True if the fingerprint is valid, false otherwise
    function verifyFingerprint (CarmelAccount memory account, CarmelFingerprint calldata fingerprint) public view returns(bool) {
        if(account.username == bytes32(0)) { revert CarmelErrorAccountDoesNotExist(); }
        if(_keys_x[fingerprint.username].length <= fingerprint.keyId) revert CarmelErrorAccountInvalidKeyId();

        bytes32 x = _keys_x[fingerprint.username][fingerprint.keyId];
        bytes32 y = _keys_y[fingerprint.username][fingerprint.keyId];

        return _verifier.verify(fingerprint.message, fingerprint.signature, x, y);
    }
}
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
 *  CarmelBase.sol                                                                                          *  
 *                                                                                                           *                                                                                                       *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title The starting point for all Carmel contracts
/// @author I. Dan Calinescu
/// @notice This sets the base for all Carmel contracts
abstract contract CarmelBase {

    /// @notice Carmel errors
    error CarmelErrorPermissionsAdminLevelRequired();
    error CarmelErrorPermissionsSentinelLevelRequired();
    error CarmelErrorAccountDoesNotExist();
    error CarmelErrorAccountAlreadyExists();
    error CarmelErrorAccountInvalidKeyId();
    error CarmelErrorUnauthorizedAccount();
    error CarmelErrorCannotWithdrawZeroAmount();
    error CarmelErrorCannotWithdrawInsufficientFunds();
    error CarmelErrorAssetNotMinted();
    error CarmelErrorAssetMintingUnauthorized();
    error CarmelErrorAssetMintingInvalidQuantity();
    error CarmelErrorAssetMintingMaxSupplyReached();
    error CarmelErrorAssetMintingInvalidPrice();
    error CarmelErrorAssetMintingInsufficientBalance();

    /// @notice This represents an individual Carmel Fingerprint
    struct CarmelFingerprint {
        uint256 keyId;
        bytes32 username; 
        bytes32 message;
        bytes signature;
    }

    /// @notice This represents an individual Carmel Account
    struct CarmelAccount {
        uint256 id;
        bytes32 username;
        bytes32 group;
        uint32 total_keys;
        uint32 total_addresses;
    }

    /// @dev Constants used to track permissions
    uint8 constant internal ADMIN_PERM = 99;
    uint8 constant internal SENTINEL_PERM = 50;
    uint8 constant internal START_PERM = 1;

    /// @dev Admin-owned permissions
    mapping(address => uint8) internal _perms;

    /// @notice Helper to ensure sentinel permissions on a function
    modifier requireSentinel() {
      if(_perms[msg.sender] < SENTINEL_PERM) revert CarmelErrorPermissionsSentinelLevelRequired();
      _;
    } 
    
    /// @notice Helper to ensure admin permissions on a function
    modifier requireAdmin() {
      if(_perms[msg.sender] < ADMIN_PERM) revert CarmelErrorPermissionsAdminLevelRequired();
      _;
    }

    /***********************************************************************\
    *                 _             _                                       *
    *       __ _   __| | _ __ ___  (_) _ __     __ _  _ __  ___   __ _      *
    *      / _` | / _` || '_ ` _ \ | || '_ \   / _` || '__|/ _ \ / _` |     *
    *     | (_| || (_| || | | | | || || | | | | (_| || |  |  __/| (_| |     *
    *      \__,_| \__,_||_| |_| |_||_||_| |_|  \__,_||_|   \___| \__,_|     *
    \***********************************************************************/

    /// @notice
    function updatePerms (address addr, uint8 level) public requireAdmin {
        _perms[addr] = level;
    }
}
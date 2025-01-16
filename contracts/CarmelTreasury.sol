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
 *  CarmelTreasury.sol                                                                                          *  
 *                                                                                                           *                                                                                                       *
 *  This code is part of the Carmel City platform (https://carmel.city) and open sourced at:                 *
 *  https://github.com/carmelcity                                                                            *
 *                                                                                                           * 
 \***********************************************************************************************************/                                                                                                          

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./CarmelRegistry.sol";

/// @title The Carmel Treasury
/// @author I. Dan Calinescu
/// @notice Responsible for managing funds for registered Carmel Accounts
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract CarmelTreasury is Initializable, CarmelBase {

    /// @dev 
    event CarmelDeposit(bytes32 username, uint256 amount);
    
    /// @dev
    mapping(bytes32 => uint256) private _balances;

    /// @dev
    CarmelRegistry private _registry;

    /// @dev Keep track of the main owner of this registry
    address private _owner;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

   function initialize(
        address sender,
        address reg
    ) initializer public {
        _owner = sender;
        _registry = CarmelRegistry(reg);
   }

   /// @notice
   function deposit(bytes32 username) payable external {
        _balances[username] += msg.value;
        emit CarmelDeposit(username, msg.value);
   }

   /// @notice
   function getBalance(bytes32 username) public view returns (uint256) {
     return _balances[username];
   }

   /// @notice
   function withdraw (address payable to, uint256 amount, CarmelFingerprint calldata fingerprint) payable external {
        if(amount <= 0) { revert CarmelErrorCannotWithdrawZeroAmount(); }
        if (!_registry.verify(fingerprint)) { revert CarmelErrorUnauthorizedAccount(); }
        if(getBalance(fingerprint.username) < amount) { revert CarmelErrorCannotWithdrawInsufficientFunds(); }

        to.transfer(amount);
   }
}
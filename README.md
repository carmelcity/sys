<p align="center"> <img src="https://raw.githubusercontent.com/carmelcity/carmelcity.github.io/refs/heads/main/sys/banner.png" width="100%">
</p>

# Carmel City System

[![Code](https://img.shields.io/static/v1?label=CODE&message=MIT%20LICENSE&color=%231976D2&style=for-the-badge)](https://docs.carmel.city/sys/coverage/index.html)
[![Tests](https://img.shields.io/static/v1?label=Tests&message=PASSING✓&color=%23388E3C&style=for-the-badge)](https://docs.carmel.city/sys/coverage/index.html)
[![Coverage](https://img.shields.io/static/v1?label=Coverage&message=100%&color=%23388E3C&style=for-the-badge)](https://docs.carmel.city/sys/coverage/index.html)

The **Carmel City System** is a group of Smart Contracts that represent the core functionality of the Carmel City Platform, on-chain. This includes the **Carmel Verifier**, the **Carmel Registry** and the **Carmel Treasury**. The system manages contracts, handles deposits and performs self-sovereign federated account operations, and much more.

## Smart Contracts

### The Verifier

The **Carmel Verifier** is in charge of verifying Secp256r1 WebAuthn signatures.

[![Code](https://img.shields.io/static/v1?label=source%20code&message=CarmelVerifier.sol&color=%231976D2)](https://github.com/carmelcity/sys/blob/main/contracts/CarmelVerifier.sol)
[![Tests](https://img.shields.io/static/v1?label=tests&message=passing%20✓&color=%23388E3C)](https://docs.carmel.city/sys/coverage/contracts/CarmelVerifier.sol.html)
[![Coverage](https://img.shields.io/static/v1?label=coverage&message=100%&color=%23388E3C)](https://docs.carmel.city/sys/coverage/contracts/CarmelVerifier.sol.html)

### The Registry

The **Carmel Registry** keeps track of all Carmel Accounts and associated data such as public keys

[![Code](https://img.shields.io/static/v1?label=source%20code&message=CarmelRegistry.sol&color=%231976D2)](https://github.com/carmelcity/sys/blob/main/contracts/CarmelRegistry.sol)
[![Tests](https://img.shields.io/static/v1?label=tests&message=passing%20✓&color=%23388E3C)](https://docs.carmel.city/sys/coverage/contracts/CarmelRegistry.sol.html)
[![Coverage](https://img.shields.io/static/v1?label=coverage&message=100%&color=%23388E3C)](https://docs.carmel.city/sys/coverage/contracts/CarmelRegistry.sol.html)

### The Treasury

The **Carmel Treasury** is responsible for managing funds for registered Carmel Accounts

[![Code](https://img.shields.io/static/v1?label=source%20code&message=CarmelTreasury.sol&color=%231976D2)](https://github.com/carmelcity/sys/blob/main/contracts//CarmelTreasury.sol)
[![Tests](https://img.shields.io/static/v1?label=tests&message=passing%20✓&color=%23388E3C)](https://docs.carmel.city/sys/coverage/contracts/CarmelTreasury.sol.html)
[![Coverage](https://img.shields.io/static/v1?label=coverage&message=100%&color=%23388E3C)](https://docs.carmel.city/sys/coverage/contracts/CarmelTreasury.sol.html)

## Code Quality

The code is covered 100% by tests, including all execution logic branches.

![coverage](https://docs.carmel.city/sys/coverage.png)

The code passes dozens of extensive test cases.

![tests](https://docs.carmel.city/sys/tests.png)

## Contributing

We welcome contributions from everyone! You can help by fixing bugs, suggesting some improvements, or even adding new features. Your contributions help us make Carmel City better for everyone. 

To get started, have take a look at the [Contributing Guidelines](https://github.com/carmelcity/.github/blob/main/CONTRIBUTING.md) and read the instructions carefully.

## Maintenance

The Carmel City code is maintained by [@idancali](https://github.com/idancali) and sponsored by [Fluid Trends](https://fluidtrends.com).

## License

The Carmel City platform is licensed under the [MIT License](https://github.com/carmelcity/.github/blob/main/LICENSE).

Copyright (C) 2025 - I. Dan Calinescu                
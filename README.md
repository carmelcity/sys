<p align="center"> <img src="https://raw.githubusercontent.com/carmelcity/web/main/public/images/banner_placeholder.webp" width="100%">
</p>

# Carmel City System

[![Tests](https://img.shields.io/static/v1?label=Tests&message=PASSING✓&color=%23009688&style=for-the-badge)](coverage/index.html)
[![Coverage](https://img.shields.io/static/v1?label=Coverage&message=100%&color=%23009688&style=for-the-badge)](coverage/index.html)

The **Carmel City System** is a group of Smart Contracts that represent the core functionality of the Carmel City Platform, on-chain. This includes the **Carmel Verifier**, the **Carmel Registry** and the **Carmel Treasury**. The system manages contracts, handles deposits and performs self-sovereign federated account operations, and much more.

## Smart Contracts

### The Verifier

The **Carmel Verifier** is in charge of verifying Secp256r1 WebAuthn signatures.

[![Tests](https://img.shields.io/static/v1?label=tests&message=passing%20✓&color=%23388E3C)](coverage/contracts/CarmelVerifier.sol.index.html)
[![Coverage](https://img.shields.io/static/v1?label=coverage&message=100%&color=%23388E3C)](coverage/contracts/CarmelVerifier.sol.index.html)
[![Code](https://img.shields.io/static/v1?label=source%20code&message=CarmelVerifier.sol&color=%231976D2)](contracts/CarmelVerifier.sol)

### The Registry

The **Carmel Registry** keeps track of all Carmel Accounts and associated data such as public keys

[![Tests](https://img.shields.io/static/v1?label=tests&message=passing%20✓&color=%23388E3C)](coverage/contracts/CarmelRegistry.sol.index.html)
[![Coverage](https://img.shields.io/static/v1?label=coverage&message=100%&color=%23388E3C)](coverage/contracts/CarmelRegistry.sol.index.html)
[![Code](https://img.shields.io/static/v1?label=source%20code&message=CarmelRegistry.sol&color=%231976D2)](contracts/CarmelRegistry.sol)

### The Treasury

The **Carmel Treasury** is responsible for managing funds for registered Carmel Accounts

[![Tests](https://img.shields.io/static/v1?label=tests&message=passing%20✓&color=%23388E3C)](coverage/contracts/CarmelTreasury.sol.index.html)
[![Coverage](https://img.shields.io/static/v1?label=coverage&message=100%&color=%23388E3C)](coverage/contracts/CarmelTreasury.sol.index.html)
[![Code](https://img.shields.io/static/v1?label=source%20code&message=CarmelTreasury.sol&color=%231976D2)](contracts/CarmelTreasury.sol)

## Code Quality

The code is covered 100% by tests, including all execution logic branches.

![coverage](test/allcoverage.png)

The code passes dozens of extensive test cases.

![tests](test/alltests.png)

## Contributing

We welcome contributions from everyone! You can help by fixing bugs, suggesting some improvements, or even adding new features. Your contributions help us make Carmel City better for everyone. 

To get started, have take a look at the [Contributing Guidelines](CONTRIBUTING.md) and read the instructions carefully.

## Maintenance

The Carmel City code is maintained by [@idancali](https://github.com/idancali) and sponsored by [Fluid Trends](https://fluidtrends.com).

## License

The Carmel City platform is licensed under the [MIT License](LICENSE).

Copyright (C) 2025 - I. Dan Calinescu                
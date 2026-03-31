# **HashCompanion Development Console**

The **HashCompanion Development Console** is a platform that allows developers to connect their Hedera Testnet wallet, manage apps, and interact with smart contracts. Through this console, developers can manage app listings, and publish new apps on the HashCompanionStore, all while having an easy-to-use interface that simplifies the interaction with Hedera blockchain services.

## Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)

  * [Connect Wallet](#connect-wallet)
  * [Managing Apps](#managing-apps)
  * [Publishing Apps](#publishing-apps)
* [File Structure](#file-structure)
* [Technologies Used](#technologies-used)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)


## Overview

The **HashCompanion Development Console** is designed to simplify app development and management on the Hedera Testnet for HashCompanion. With this console, you can easily:

* Connect your Hedera wallet using your account ID and private key.
* Add and manage apps in the **App Manager**.
* Publish your app's details to the Hedera network via smart contracts.

This console provides a smooth integration between your wallet and smart contract interactions, and it's designed for developers looking to deploy their applications on the Hedera Testnet.



## Features

* **Wallet Integration**: Connect your Hedera wallet using Account ID and Private Key.
* **App Management**: Add, list, and manage apps that interact with the Hedera network.
* **Smart Contract Interaction**: Publish apps by interacting with a smart contract for app storage and management.
* **EVM Address**: Convert Hedera Account IDs into EVM-compatible addresses.
* **Account Switching**: Switch between multiple Hedera wallets and maintain easy access to the apps for each wallet.
* **Error Handling & Notifications**: Built-in error handling and notifications to keep you informed.
* **Real-time Balance Fetching**: Displays the balance of the connected Hedera account.


## Prerequisites

Before using the **HashCompanion Development Console**, you need:

* **Hedera Testnet Account**: You will need a Hedera Testnet account for interacting with the console. Create a new account via [Hedera Portal](https://portal.hedera.com).
* **Hedera SDK**: Make sure you have the Hedera SDK installed and set up for integration.
* **Node.js and npm/yarn**: The application is built using Node.js, and you will need npm or yarn to install the dependencies.



## Installation

### 1. Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/yourusername/hashcompanion-development-console.git
cd hashcompanion-development-console
```

### 2. Install Dependencies

Install the required dependencies:

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and define the following variables:

```
VITE_NETWORK=mainnet|testnet
VITE_API_URL=<Your_API_Url>
```

Make sure you have the proper environment configured for the network you're working on (mainnet or testnet).



## Usage

### Connect Wallet

1. **Enter Your Account ID and Private Key**:

   * The **HashCompanion Developer Console** allows you to securely enter your Hedera **Account ID** and **Private Key** to authenticate and interact with the Hedera network.
   * On successful connection, your wallet’s balance and details will be fetched.

2. **Automatic Connection**:

   * If enabled, the app will automatically connect to the wallet using the saved credentials (Account ID and Private Key).

3. **Wallet Information**:

   * The app will display your **EVM Address** converted from your Hedera Account ID, allowing for interactions with Ethereum-based applications.



### Managing Apps

* **View Existing Apps**:

  * You can view all apps associated with your wallet in the **App Manager**. The list shows your app's title, description, and ID.

* **Edit Apps**:

  * Update app details such as the title and description directly from the **App Manager** interface.

* **Delete Apps**:

  * If needed, you can delete apps that are no longer necessary via the app’s settings within the **App Manager**.



### Publishing Apps

* **Add New App**:

  * Use the **Add App** form to create new apps. Provide essential details like title and description.

* **Smart Contract Interaction**:

  * After filling the app details, you can publish the app by calling the smart contract `addApp` function to store the app information on the Hedera network.

* **Transaction Confirmation**:

  * After publishing the app, the transaction receipt will be displayed confirming the successful deployment.



## File Structure

Here is the directory structure of the project:

```
HashCompanionDeveloperConsole
├── public
│   ├── favicon.svg
│   └── icons.svg
├── src
│   ├── assets
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── Components
│   │   ├── AppCard.tsx
│   │   ├── AppForm.tsx
│   │   ├── AppList.tsx
│   │   ├── AppManager.tsx
│   │   └── HashCompanionDeveloperConsole.tsx
│   ├── utils
│   │   └── hashCompanionStore.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Key Components:

* **`HashCompanionDeveloperConsole.tsx`**: Main entry point for connecting your Hedera wallet and managing the connection process.
* **`AppManager.tsx`**: Manages your apps and allows adding, listing, and deleting apps.
* **`AppForm.tsx`**: Form for adding new apps.
* **`AppCard.tsx`**: Displays individual app cards.
* **`AppList.tsx`**: Lists all your published apps.
* **`hashCompanionStore.ts`**: Handles storage and retrieval of account data.
* **`App.tsx`**: Root component that initializes the app.



## Technologies Used

* **React**: Front-end library used for building the UI.
* **React Router**: Used for routing and navigating between different views.
* **Hedera SDK**: Provides access to the Hedera network for wallet management and smart contract interaction.
* **TypeScript**: Type-safe JavaScript for better developer experience.
* **Vite**: Fast build tool for React projects.
* **React Toastify**: For notifications and error handling.



## Contributing

We welcome contributions to **HashCompanion Developer Console**! To get started:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Create a new branch: `git checkout -b feature/your-feature`.
4. Commit your changes.
5. Push to your fork: `git push origin feature/your-feature`.
6. Create a pull request.



## Third-Party Tools & Disclaimer
This Project is Part of **HashCompanion** for the developpement of **HashCompanionStore Apps**

- [repo Link](https://github.com/rocker-bell/HashCompanion)

- [Live Demo](https://rocker-bell.github.io/HashCompanion/)

This project may interact with or reference third-party tools and services, these tools are used strictly for development and educational purposes.

**FeedBack**
If you have any feedback or review, feel free to contact me on telegram @HashForce_apex


## License

© 2026 rocker_bell. All rights reserved.

This project and its source code are proprietary. 

**Only the owner** (rocker_bell) or **explicitly designated parties** may use, copy, modify, merge, publish, distribute, sublicense, or sell any part of this project.

Any unauthorized use, reproduction, modification, or distribution by others is strictly prohibited.

##  Note

> This project and repository are **actively maintained** and **regularly updated**.
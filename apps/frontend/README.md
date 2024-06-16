Globtera
========

Welcome to **Globtera**, a micro-donation platform that leverages the Stellar blockchain network to enable seamless, secure, and transparent donations. This README file will guide you through the project's architecture, setup instructions, and core functionalities.

Table of Contents
-----------------

*   [Introduction](#introduction)
*   [Features](#features)
*   [Technologies Used](#technologies-used)
*   [Prerequisites](#prerequisites)
*   [Installation](#installation)
*   [Usage](#usage)
*   [Stellar Integration](#stellar-integration)
*   [Database Schema](#database-schema)
*   [API Endpoints](#api-endpoints)
*   [Contributing](#contributing)
*   [License](#license)

Introduction
------------

Globtera is designed to facilitate micro-donations to various organizations and causes through a user-friendly interface. Users can sign up, view posts from organizations, and make donations directly through the platform using Stellar's blockchain technology.

Features
--------

*   **User and Organization Management**: Separate interfaces and functionalities for users and organizations.
*   **Stellar Blockchain Integration**: Secure and transparent transactions using Stellar's testnet.
*   **Donation Tracking**: Track total donations received by organizations and individual donation records.
*   **Secure Authentication**: User authentication and authorization using JWT.

Technologies Used
-----------------

### Frontend

*   **React**: JavaScript library for building user interfaces.
*   **TypeScript**: Superset of JavaScript that adds static typing.
*   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.

### Backend

*   **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
*   **Express**: Fast, unopinionated, minimalist web framework for Node.js.
*   **Prisma**: Next-generation ORM for Node.js and TypeScript.
*   **PostgreSQL**: Open source relational database management system.
*   **Stellar SDK**: JavaScript library for interacting with the Stellar blockchain.

Prerequisites
-------------

Before you begin, ensure you have met the following requirements:

*   **Node.js**: v14.x or later
*   **npm**: v6.x or later
*   **PostgreSQL**: v12.x or later
*   **Stellar SDK**: Follow the [official documentation](https://stellar.github.io/js-stellar-sdk/index.html)

Installation
------------

### Clone the Repository


```
git clone https://github.com/your-username/globtera.git cd globtera
```

### Backend Setup

1.  **Install Dependencies**:
    
    `cd backend npm install`
    
2.  **Environment Variables**:
    
    Create a `.env` file in the `backend` directory and configure the following environment variables:
    
    env
    
    Copy code
    
    `DATABASE_URL=postgresql://username:password@localhost:5432/globtera JWT_SECRET=your_jwt_secret`
    
3.  **Database Migration**:
    
    sh
    
    Copy code
    
    `npx prisma migrate dev --name init`
    
4.  **Start the Backend Server**:
    
    sh
    
    Copy code
    
    `npm run dev`
    

### Frontend Setup

1.  **Install Dependencies**:
    
    sh
    
    Copy code
    
    `cd frontend npm install`
    
2.  **Start the Frontend Server**:
    
    sh
    
    Copy code
    
    `npm start`
    

Usage
-----

### User Signup

1.  **Create Account**:
    
    *   Users and organizations can sign up by providing their email, name, password, and other necessary details.
    *   A wallet address will be automatically generated using the Stellar SDK and stored in the database.
2.  **Login**:
    
    *   Users and organizations can log in using their email and password to receive a JWT token for authentication.

### Making Donations

1.  **Browse Posts**:
    
    *   Users can view posts made by organizations, each detailing a cause or project that requires donations.
2.  **Donate**:
    
    *   Users can donate to a post by entering the donation amount and their Stellar secret key.
    *   The donation is processed on the Stellar testnet, and the transaction is recorded in the database.

Stellar Integration
-------------------

### Account Creation

We use the Stellar SDK to create new accounts and fund them via the friendbot for the testnet environment. This includes generating a public-private key pair and requesting initial funds.

### Making Donations

The donation process involves:

1.  **Loading the Source Account**:
    
    *   Using the Stellar secret key to load the user's account.
2.  **Creating a Transaction**:
    
    *   Building and signing a transaction to transfer the specified amount to the organization's wallet address.
3.  **Submitting the Transaction**:
    
    *   Submitting the signed transaction to the Stellar testnet.

Database Schema
---------------

We use Prisma to manage our PostgreSQL database schema. The schema includes models for `User`, `Org`, `Post`, and `Donation`.

prisma

Copy code

`datasource db {   provider = "postgresql"   url      = env("DATABASE_URL") }  generator client {   provider = "prisma-client-js" }  model User {   id             Int        @id @default(autoincrement())   email          String     @unique   name           String   password       String   walletAddress  String   donations      Donation[] }  model Org {   id             Int        @id @default(autoincrement())   email          String     @unique   name           String   password       String   walletAddress  String   totalDonation  Float      @default(0)   posts          Post[]   donations      Donation[] }  model Post {   id             Int        @id @default(autoincrement())   title          String   content        String   publishedOn    DateTime   publishedBy    String   totalDonation  Float      @default(0)   orgId          Int   org            Org        @relation(fields: [orgId], references: [id])   donations      Donation[] }  model Donation {   id             Int        @id @default(autoincrement())   amount         Float   userId         Int   user           User       @relation(fields: [userId], references: [id])   orgId          Int   org            Org        @relation(fields: [orgId], references: [id])   postId         Int?   post           Post?      @relation(fields: [postId], references: [id])   createdAt      DateTime   @default(now()) }`

API Endpoints
-------------

### User Routes

*   `POST /signup`: Create a new user or organization.
*   `POST /signin`: Authenticate a user or organization.

### Post Routes

*   `GET /posts`: Retrieve all posts.
*   `GET /posts/:id`: Retrieve a specific post.

### Donation Routes

*   `POST /donation/donate`: Make a donation to an organization.

### Example Donation Request

json

Copy code

`{   "userId": 1,   "orgId": 2,   "amount": 10,   "secretKey": "SDJ5K7HQY5QYER...XK6JH5K7H35" }`

Contributing
------------

Contributions are welcome! Please fork the repository and create a pull request with your changes.

License
-------

This project is licensed under the MIT License. See the LICENSE file for details.

* * *

Thank you for using Globtera! If you have any questions or need further assistance, please feel free to contact us.
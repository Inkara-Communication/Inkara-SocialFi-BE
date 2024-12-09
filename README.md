# NestJS NFT SocialFi

Welcome to the NestJS NFT SocialFi project! This is a full-stack application built using NestJS, Prisma, and PostgreSQL. The project provides user authentication, NFTs collection, and a launchpad for new collections. It's designed to help you get started with building your own NFT SocialFi.

## Features

- User Authentication: Secure user registration and login using JWT tokens.
- NFTs Collection: Create, manage, and showcase your unique NFTs.
- Launchpad: Introduce new NFT collections to the market with pre-sales and auctions.

## Prerequisites

- Node.js (v18 or higher)
- Docker (for PostgreSQL)
- Prisma CLI (installed globally)
- Yarn package manager

## Getting Started

1. Clone the repository:

```sh
   git clone https://github.com/Inkara-Communication/Inkara-SocialFi-BE.git
   cd Inkara-SocialFi-BE
```

2. Install dependencies:

```sh
  yarn install
```

3. Set up your PostgreSQL database using Docker:

```sh
  yarn dev:docker 
```

4. Set up your Prisma schema and generate the Prisma client:

```sh
  npx prisma generate
```

5. Start the development server:

```sh
  yarn start:dev
```

# Usage

- Register a new user account.
- Log in to your account.
- Create and manage your NFT collections.
- Explore the SocialFi and participate in launchpad events.

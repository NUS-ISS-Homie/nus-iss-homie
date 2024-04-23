# Homie

This is `Group 7`'s NUS-ISS Designing Modern Software Systems project.

Group Members:

- Dylan Goh Zhi Kai
- [Erin May Gunawan](https://github.com/erinmayg)
- [Florencia Martina](https://github.com/florenciamartina)
- Muhamad Ar Iskandar Bin Zulkifli
- Zephan Wong Kai En

## Tech Stack

|                    | Technology                     |
| ------------------ | ------------------------------ |
| Frontend           | ReactTS                        |
| Backend            | Node.js, Express.js, Socket.io |
| Database           | MongoDB                        |
| Project Management | JIRA                           |

## Project Setup

### Tech Stack

#### Node.js

Ensure you have `Node.js` installed in your PC. You can check by running `node -v`, it should return the version of Node you have.

If you don't have node installed on your machine, refer to their [installation guide](https://nodejs.org/en/download/) for details.

If you want to run multiple node versions and you're using unix or WSL use [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script).

Our project is compatible with Node versions: `14.x`, `16.x`, `18.x`, `20.x`

#### MongoDB Atlas

This project requires a MongoDB Atlas account. ([Sign up](https://www.mongodb.com/cloud/atlas/register) / [sign in](https://account.mongodb.com/account/login?nds=true)).

### Set up .env

Duplicate [`.env.sample`](https://github.com/NUS-ISS-Homie/nus-iss-homie/blob/main/backend/.env.sample) file and fill in with the agreed-upon values.

Note: `DB_CLOUD_URI` is used for `ENV=PROD` and `DB_CLOUD_URI_TEST` is used for `ENV=TEST`

### Running Env

To run this project, ensure that you've created a `backend/.env` file based on the [`.env.sample`](https://github.com/NUS-ISS-Homie/nus-iss-homie/blob/main/backend/.env.sample), and run the following commands from the project root:

```bash
# Install dependencies
npm i
npm run install-dep

# Run the project (frontend and backend concurrently)
npm run dev

# Run the project (frontend and backend independently)
cd frontend && npm run start
cd backend && npm run dev
```
### Setup Load Testing

To setup Artillery.io, ensure that you have installed the most recent LTS release of Node.js.

```bash
# Install dependencies
npm install -g artillery@latest

# Check installation
npx artillery dino
artillery version

# Run the test
cd scripts
artillery run load_test_with_csv.yaml
```

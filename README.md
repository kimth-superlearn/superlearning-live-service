<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

This service is deployed to **OCI (Oracle Cloud Infrastructure)** using GitHub Actions with Docker images pushed to OCI Container Registry (OCIR).

### How to deploy

1. Go to **Actions** > **Deploy Live Service** in GitHub
2. Click **Run workflow**
3. Select the target environment (`DEV` or `PROD`) and deployment strategy
4. Click **Run workflow** to start

### Deployment strategies

| Strategy | Description | When to use |
| --- | --- | --- |
| `auto` | DEV defaults to `fast`, PROD forced to `rolling` | Default choice |
| `fast` | SSH into running instances and restart the service | Quick iteration on DEV |
| `rolling` | Scale up pool with new instance, then scale down old | Safe production deploys |

### Required GitHub variables and secrets

Configure these in **Settings > Environments** for each environment (`DEV`, `PROD`).

#### Variables (`vars.*`)

| Variable | Description |
| --- | --- |
| `OCI_REGION` | OCI region (e.g. `ap-chuncheon-1`) |
| `OCI_COMPARTMENT_ID` | OCI compartment OCID |
| `OCI_TENANCY_OCID` | OCI tenancy OCID |
| `OCI_CLI_USER_OCID` | OCI API user OCID |
| `OCI_CLI_FINGERPRINT` | OCI API key fingerprint |
| `OCI_OCIR_USERNAME` | OCIR login username |
| `LIVE_INSTANCE_POOL_ID` | Instance pool OCID for live service |
| `LIVE_INSTANCE_CONFIGURATION_ID` | Instance configuration OCID (rolling deploy) |
| `MYSQL_HOST` | MySQL host |
| `MYSQL_PORT` | MySQL port (default: `3306`) |
| `MYSQL_USER` | MySQL user |
| `MYSQL_DATABASE` | MySQL database name |
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port (default: `6379`) |
| `CATENOID_API_BASE_URL` | Catenoid (Kollus) API base URL |
| `LIVE_SSH_USER` | SSH user for fast deploy |
| `LIVE_SSH_PORT` | SSH port for fast deploy (default: `22`) |
| `SSH_PROXY_JUMP` | Bastion host for SSH (`user@host` format) |

#### Secrets (`secrets.*`)

| Secret | Description |
| --- | --- |
| `OCI_CLI_PRIV_KEY` | OCI API private key (PEM) |
| `OCI_OCIR_AUTH_TOKEN` | OCIR auth token |
| `MYSQL_PASSWORD` | MySQL password |
| `MONGO_URI` | MongoDB connection URI |
| `JWT_SECRET` | JWT signing secret |
| `CATENOID_SERVICE_ACCOUNT_KEY` | Catenoid service account key |
| `CATENOID_API_ACCESS_TOKEN` | Catenoid API access token |
| `CATENOID_CUSTOM_KEY` | Catenoid custom key |
| `CATENOID_SECURITY_KEY` | Catenoid security key |
| `LIVE_SSH_KEY` | SSH private key for fast deploy |
| `LIVE_SSH_PROXY_KEY` | SSH private key for bastion (if using proxy jump) |

### Docker

The service includes a multi-stage `Dockerfile`. To build locally:

```bash
docker build -t superlearning-live-service .
docker run -p 3000:3000 --env-file .env superlearning-live-service
```

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

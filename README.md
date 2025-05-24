# SARIF Industries' ft_transcendence

Welcome to SARIF's (Stan Angela Rui Ilkay Fabien) transendence project! Here's the dream team behind this:

- [Stan](https://github.com/Bravnar) --> [(42 smuravye)](https://profile.intra.42.fr/users/smuravye)
- [Angela](https://github.com/nyuku) --> [(42 angnguye)](https://profile.intra.42.fr/users/angnguye)
- [Rui](https://github.com/RPDJF) --> [(42 rude-jes)](https://profile.intra.42.fr/users/rude-jes)
- [Ilkay](https://github.com/IlYAN-FISHERMAN) --> [(42 ilyanar)](https://profile.intra.42.fr/users/ilyanar)
- [Fabien](https://github.com/fclivaz42) --> [(42 fclivaz)](https://profile.intra.42.fr/users/fclivaz)

<sub>DISCLAIMER: Please do note that this project nor any people involved with or represented in it are affiliated with Deus Ex or any company involved with the IP. We just thought the acronym was comedic and went with it since we're a bunch of nerds who love sci-fi. No copyright infringement was intended!</sub>

Quick links:
- [What is an ft_transcendance??](#explanation)
- [Using/Launching the app](#using--launching)
- [Contributing and guidelines](#guidelines)
- [Footnote](#footnote)

# Explanation

ft_transcendence is a complete, single-page web-app on which you can play pong and participate in tournaments. The tech stack is imposed by the subject we legally cannot disclose. We decided to aim for a 125% completion of the project with a couple extra bonuses.

In order to play our pong game, read along!

# Using / Launching

As per the subject, ft_transcendence should be operational with *just one* command. We decided to use a Makefile instead of a bash sript to "standardize" the commands used to operate ft_transcendence. Once inside the project folder, you can execute any of the following:

| Command        | Result                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| `make`         | Builds every docker image and launches SARIF Industries.                                |
| `make all`     | Same as above.                                                                          |
| `make start`   | Starts the containers (builds them if they do not exist.)                               |
| `make stop`    | Stops the service and halts the containers.                                             |
| `make down`    | Stops the service and removes the containers.                                           |
| `make status`  | Shortcut for `docker ps -a`                                                             |
| `make network` | Shortcut for `docker network ls`                                                        |
| `make prune`   | Shortcut for `docker system prune -af`                                                  |
| `make nuke`    | Deletes SARIF entirely, its persistent data, then calls `prune`. **Dangerous!**         |
| `make re`      | Rebuilds the containers without pruning any data.                                       |
| `make rebuild` | Calls `nuke` and rebuilds everything from scratch. **Dangerous!**                       |
| `make restart` | Stops the containers and starts them again.                                             |


# Guidelines

While this is more for the core team, here is how the project is structured and how to make any modifications to it:

```
./SARIF
┌───┘
├─ Makefile -- The dockerfile used to build Core.
├─ README.md -- this very readme lmao
├─ data -- This folder will be created and that is where the permanent data is stored (eg. Database)
└─ srcs
    ├─ module_name -- Each microservice has its own subfolder.
    │    ├─ srcs -- The microservice's sources. Those are copied to the docker container.
    │    │     ├─ module_name_source_file.js -- some of the module's code.
    │    │     └─ ..etc.
    │    ├─ README.md -- The module's readme, explaining what it does and how its API works.
    │    ├─ Dockerfile -- The module's dockerfile, describing how it's built.
    │    ├─ docker-compose.yml -- Each module has its own docker-compose.yml in order to lift some weight off of the main one.
    │    └─ package.json -- Since we have to use Node/NPM, each module has its own package file describing its dependencies.
    ├─ docker-compose.yml -- The main docker-compose. It sources every other docker-compose from every submodule.
    ├─ dockerignore.example -- An example for a dockerignore, if it is necessary to use you should copy it to your submodule's folder and change it to .dockerignore.
    └─ env.example -- since .env files are ignored by .gitignore, we left a env.example with the expected variables (without their values). Fill it and rename it to .env
```

In order to add a module, you must create a subfolder containing a `Dockerfile` with the necessary commands to copy your code to the container and run the service. You also should have a `docker-compose.yml` with a `services` category describing how your service interacts with the rest of the project. Make sure to use the `API_KEY` environment variable! Else it won't be able to talk to the rest of the containers. You can get some inspiration from the other project folders.

# Footnote

As said earlier, this project is in no way shape or form associated to the Deus Ex franchise.

Here is the tech stack we used:

- [Docker](https://docker.com)
- [Node.js](https://nodejs.org)
- [Fastify](https://fastify.dev)
- [Axios](https://github.com/axios/axios)
- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
- [ethers.js](https://github.com/ethers-io/ethers.js)
- [hardhat](https://github.com/NomicFoundation/hardhat)
- [Babylon.js](https://github.com/BabylonJS/Babylon.js)

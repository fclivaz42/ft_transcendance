# SARIF Core

This document provides information about the Core's functionality.

Since the Core is the module facing the public, it must be used to properly route to every other module/service.

- [Guidelines](#guidelines)
- [The `routes` folder](#the-routes-folder)
- [The `modules` folder](#the-modules-folder)
- [Recap](#recap)

# Guidelines

Core will forward your requests to your service using the `Axios` component.

In order to make your module be taken into consideration by Core, you **must** follow a specific set of rules:

Your module will be broken into two parts: The `srcs/routes` file and the `srcs/modules` subfolder. Here is an example of the directory structure:
```
SARIF/srcs/core
┌───────────┘
├─ Dockerfile -- The dockerfile used to build Core.
├─ docker-compose.yml -- Core's own compose file.
├─ README.md -- this very readme lmao
├─ package.json -- The package declaration file.
└─ srcs
    ├─ modules
    │    ├─ database -- The database's subfolder, where it's extra logic is located.
    │    │     ├─ db_helpers.js -- some of the database's code.
    │    │     ├─ db_testers.js -- some of the database's test code.
    │    │     └─ ..etc.
    │    ├─ <your_module> <<-- Your module's subfolder. You can create it if it does not exist!
    │    │     ├─ <your_module>_helpers.js -- Example file.
    │    │     ├─ <your_module>_testers.js -- Example file.
    │    │     └─ ..etc.
    │    └─ ...etc.
    ├─ routes
    │    ├─ database.js -- the database's routing file.
    │    ├─ oauth2.js -- the OAauth's routing file.
    │    ├─ <your_module>.js <<-- This is where your routing file goes.
    │    └─ ...etc.
    └─ core_main.js -- can you don't touch this plz, i got this one i promise
```
Please remember that only the **bare minimum** of your code should be in Core, and you should be doing only basic pre-processing before forwarding the request to your own service. Do not fill Core with your logic!

# The `routes` folder

In the `srcs/routes` folder, you can leave a `<module_name>.js` file describing the routes your service handles. Core will automatically generate a lower-case prefix route for your module from the name of your file. For example, if your file is named `blockchain.js`, Core will prefix any of the subroutes you define with `/blockchain`. Thus, if you define a `/create` subroute, you must access it with `/blockchain/create`. If you (unfortunately) named your file `this_insanely_awesome_pong_game_i_just_made.js`, any subroute will be prefixed with `/this_insanely_awesome_pong_game_i_just_made` (which, let's face it, less than ideal).

Your file should contain the following:

```js
export default async function module_routes(fastify, options)
{
	fastify.get('/<subroute>', function handler(request, reply) {
		// Your logic here...
	})

	fastify.post('/<subroute>', function handler(request, reply) {
		// Your logic here...
	})

	fastify.delete('/<subroute>', function handler(request, reply) {
		// Your logic here...
	})

	fastify.put('/<subroute>', function handler(request, reply) {
		// Your logic here...
	})

	fastify.get('/<another_subroute>', function handler(request, reply) {
		// Your logic here...
	})

	// ...etc.
}
```

**It is imperative that the file contains nothing else than the default `module_routes()` function, as any extra logic you need to do, any function calls will be stored somewhere else:**

# The `modules` folder

The modules folder will be home of your own service subfolder, which can contain extra necessary logic from your routing.

**Reminder: you should have the BARE MINIMUM on the Core module!** The bulk of your code should be in your own environment, not here. This folder exists to help you have some extra logic (eg. to check if the service is online, pre-parsing user input, etc.) before forwarding the request to your endpoint. You are free to structure this as you see fit.

# Recap

- The name of your file will define the prefix of the route you wish to establish.
- That file should contain an *(breathes in)* `export default async function module_routes()` function (god i love js) which will be called by Core. Therefore, that function should contain any fastify method/route combo you wish to implement.
- Any extra necessary code, functions, tests or whatever should be stored in a subfolder of `modules`, in order to avoid dealing with other people's files. You can structure that how you please.
- Keep in mind that only what is necessary (eg. preprocessing, input sanitizing) should be done here! Your service should still handle the bulk of your logic.
- Have fun? I guess? and message me if you have issues or whatever idk

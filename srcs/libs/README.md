# Libs module
This module is a builder like frontend module.
It is only intended to be executed once during the build process to generate the necessary files in `/libs/` directory.

`/libs/` directory is binded to `sarif-libs` volume in the docker-compose file.

## How to use libs module
In your docker-compose add:
```yaml
...
volumes:
  sarif-libs:/libs
...
```
**Note**: You can replace `/libs` root path by any other path, as long as the relative path from the code base can reach it.

In our scenario, your module codebase is intended to be in `sarif/srcs/` folder making `libs` accessible with the relative path `../../libs` for both docker containers and the host machine.

## Why using libs module
Libs module is intended to be used as a shared library for all other modules in the SARIF project.

I wanted to avoid copy pasting the same code in each module, for instance, the interfaces. It would have a risk of code duplication and maintenance issues if one code change is needed.

## How to contribute to libs module
Post any interfaces, functions or utilities you think can be useful for more than one module in the SARIF project. ( For instance, any code duplication you see in the codebase. )
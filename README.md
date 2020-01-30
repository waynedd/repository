# repository

An online repository to collect and present academic research papers.

### Deployment

1. Configure the node.js environment:

    - Download and install `node` and `npm` (https://nodejs.org/zh-cn/).

    - Run `npm install` in the directory of the project to install dependent modules. 

2. Configure the MySQL environment:

    - Download, install and configure `MySQL` (version 5.7).

    - Set the user and password: `repo` and `repo1234`, which can be modified in the `configuration.js` file.

3. Run the project by executing `node bin/repoisotry`, and visit the homepage via `http://localhost:3900`
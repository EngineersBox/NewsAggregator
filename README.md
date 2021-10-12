# NewsAggregator

We live in an era where both the demand and quantity of information are enormous. However, the way we store and access that information has remained unchanged, via keywords. Given such a direct association, it is hard to algorithmically determine the relationship between pieces of information.

So we want to introduce a knowledge engine to work with data inference within a given search. Wolfram Alpha does just this, but limited to mathematical context. We will branch beyond this into many subjects and topics including news and knowledge databases.

Thus, we are building a knowledge engine that will utilise machine learning models to show and find information related to a query. Users will be able to search for information that has better association, allowing them the ability to more efficiently learn and expand on a topic

## Overview

Setting up the components of News Aggregator is suprisingly straightforward. We rely on Dockerized services in order to ensure ease of use, modularity, reliability and configurability. Each of the Redis, Elasticsearch, Frontend and Backend containers have portions of the repository shared onto this via mounted volumes, including configuration.

From the get go, there isn’t any additional configuration properties to alter, its mostly ensuring the required tooling is installed.

## Dependencies

In order to start up the services and work on them there is a few bits a pieces to install. Off the bat you will need to have the following installed:

| Tool                                                                                                           	| Download                                                                                                                                                                                                                                             	|
|----------------------------------------------------------------------------------------------------------------	|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| Git                                                                                                            	| This should already by installed, but if it isn’t then you can find installation instructions here:<br><https://git-scm.com/book/en/v2/Getting-Started-Installing-Git>                                                                               	|
| Docker                                                                                                         	| Mac: <https://docs.docker.com/docker-for-mac/install/><br>Windows: <https://docs.docker.com/docker-for-windows/install/><br>Linux: <https://docs.docker.com/engine/install/ubuntu/>                                                                  	|
| Python 3.8                                                                                                     	| <https://www.python.org/downloads/release/python-3810/>                                                                                                                                                                                              	|
| Node JS                                                                                                        	| <https://nodejs.org/en/download/>                                                                                                                                                                                                                    	|
| An IDE and/or text editor such as:<br>* VSCode<br>* IntelliJ<br>* Sublime Text<br>* Atom<br>* PyCharm<br>* etc 	| * <https://code.visualstudio.com/><br>* <https://www.sublimetext.com/><br>* <https://atom.io/><br>* <https://www.jetbrains.com/idea/><br>* <https://www.jetbrains.com/pycharm/>                                                                      	|
| Ansible [Optional]                                                                                             	| We use ansible for the deployment system. If you are not working on it then you can skip installing it.<br>However here is the installation page if need be:<br><https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html> 	|
| Rust + Cargo (Rust CLI) [Optional]                                                                                    	| If you are working on the Redis modules, then you’ll need to install Rust and it's Cargo cli tool.<br>You can do so with the following instructions:<br><https://www.rust-lang.org/tools/install><br><https://doc.rust-lang.org/cargo/getting-started/installation.html>                                 	|

Once you have those installed, we can move on to setting up the repo itself.

## Repository Local setup

You’ll first want to clone down the repo onto your local machine by using the following command:

```shell
git clone https://github.com/EngineersBox/NewsAggregator.git
```

### Frontend

If you are looking to work on the frontend portion of the repo, then you’ll want to head over to the `frontend` directory.

1. Run `npm i` to install all the relevant npm packges
2. In a seperate terminal window/tab run `npm run serve` to start the local development server
3. Open up your IDE or text editor of choice in the `frontend` directory

### Backend

Running the backend flask API is also straightforward. You’ll need to be in the top level `NewsAggregator` directory for this.

1. Run `python3 -m pip install -r requirements.txt` to setup all the dependencies
2. Install the SpaCy transform with `python3 -m spacy download en_core_web_trf`
3. Ensure you have execute permissions on the start script with `sudo chmod +x ./run_server.sh`
4. Run the start script with `./run_server.sh`

### Dockerized Services

Even when developing for Redis or Elasticsearch, we recommend running them in their Dockerized states. This alleviates having to configure the environment for them to run in.

On the other hand, if you are developing the Dockerized platform, testing deployable situations or otherwise this also applies. Note that the containers will be deployed with the host network attached, allowing you to directly access the ports for services such as Elasticsearch as if they were running on your regular local environment (E.g. `localhost:9200`)

All of the services can be ran with already define compose files. These can be found in the `compose/*` directories, depending on the component you are looking for, there will be subdirectories to account for this.

You can start any of these services as containers by running `docker compose up -d` or `docker-compose up -d` depending on your version of docker and support.

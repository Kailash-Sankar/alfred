const { services, extraSteps } = require("./config");

const generateActions = ({path, name, bind}) => {
    return {
        pull: `docker pull ${path}:latest`,
        rmImg: `docker image rm ${path}:current`,
        tag: `docker image tag ${path}:latest ${path}:current`,
        stop: `docker container stop ${name}`,
        rmContainer: `docker container rm ${name}`,
        start: `docker run -d --restart=always --network=pulse --name=${name} -p ${bind} ${path}:current`,
    }
}

const buildServiceActions = (name) => {
    const serviceInfo = services[name];
    if ( serviceInfo) {
       return {...generateActions(serviceInfo), extra: extraSteps[name] || []};
    }
}

module.exports = { buildServiceActions };
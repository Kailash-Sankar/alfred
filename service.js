const { services, extraSteps, configPath } = require("./config");

const generateActions = {
    hub: ({path, name, bind}) => {
        return [
            `docker pull ${path}:latest`,
            `docker container stop ${name}`,
            `docker container rm ${name}`,
            `docker image rm ${path}:current`,
            `docker image tag ${path}:latest ${path}:current`,
            `docker run -d --restart=always --network=pulse --name=${name} -p ${bind} ${path}:current`,
        ];
    },
    local: ({ path, name, bind, df }) => {
        return [
            `docker build -f ${configPath}/${df} -t ${name}:latest ${path}`,
            `docker container stop ${name}`,
            `docker container rm ${name}`,
            `docker image rm ${name}:current`,
            `docker image tag ${name}:latest ${name}:current`,
            `docker run -d --restart=always --network=pulse --name=${name} -p ${bind} ${name}:current`,
        ];
    }
}; 

const buildServiceActions = (name) => {
    const serviceInfo = services[name];
    if ( serviceInfo) {
        const genFn = generateActions[serviceInfo.type || 'hub'];
       return { actions: [...genFn(serviceInfo),...(extraSteps[name] || [])]};
    }
}

module.exports = { buildServiceActions };
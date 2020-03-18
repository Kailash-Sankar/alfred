const { services, extraSteps, configPath } = require("./config");


const steps = {
    pull: (path) => `docker pull ${path}:latest`,
    stopContainer: (name) => `docker container stop ${name}`,
    removeContainer: (name) => `docker container rm ${name}`,
    removeImage: (img) => `docker image rm ${img}:current`,
    tagImage: (img) => `docker image tag ${img}:latest ${img}:current`,
    build: (df, name, path) =>`docker build -f ${configPath}/${df} -t ${name}:latest ${path}`,
    start: (name, bind, path) => `docker run -d --restart=always --network=pulse --name=${name} -p ${bind} ${path}:current`,
    syncConfig: (path) => `rsync -a ${configPath} ${path}`,
}

const generateActions = {
    hub: ({path, name, bind}) => {
        return [
            { cmd: steps.pull(path), req: true},
            { cmd: steps.stopContainer(name), req: false },
            { cmd: steps.removeContainer(name), req: false },
            { cmd: steps.removeImage(path), req: false },
            { cmd: steps.tagImage(path), req: true },
            { cmd: steps.start(name, bind, path), req: true}
        ];
    },
    local: ({ path, name, bind, df }) => {
        return [
            { cmd: steps.syncConfig(path), req: false },
            { cmd: steps.build(df,name, path), req: true },
            { cmd: steps.stopContainer(name), req: false },
            { cmd: steps.removeContainer(name), req: false },
            { cmd: steps.removeImage(name), req: false },
            { cmd: steps.tagImage(name), req: true },
            { cmd: steps.start(name, bind, name), req: true }
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

const servicesList = () => Object.keys(services).join(', ');

module.exports = { buildServiceActions, servicesList };
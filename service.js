const { services, extraSteps, configPath, network } = require("./config");

// TODO: cleanup

const steps = {
    pull: (path, version='latest') => `docker pull ${path}:${version}`,
    stopContainer: (name) => `docker container stop ${name}`,
    removeContainer: (name) => `docker container rm ${name}`,
    removeImage: (img) => `docker image rm ${img}:current`,
    tagImage: (img) => `docker image tag ${img}:latest ${img}:current`,
    build: (df, name, path) => {
        let dockerfile = '';
        if (df != "default" ) {
            dockerfile = `-f ${configPath}/${df}`;
        }
        return `docker build ${dockerfile} -t ${name}:latest ${path}`;
    },
    start: (name, bind, path, version="current") => `docker run -d --restart=always ${network} --name=${name} -p ${bind} ${path}:${version}`,
    mountedStart: (name, bind, path, version="current", volume) => 
        `docker run -d --restart=always ${network} --name=${name} -p ${bind} -v ${volume} ${path}:${version}`,
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
    },
    standard: ({  path, name, bind}) => {
        return [
            { cmd: steps.build('default', name, path), req: true },
            { cmd: steps.stopContainer(name), req: false },
            { cmd: steps.removeContainer(name), req: false },
            { cmd: steps.removeImage(name), req: false },
            { cmd: steps.tagImage(name), req: true },
            { cmd: steps.start(name, bind, name), req: true }
        ];
    },
    db_hub: ({ name, image, version, bind, volume }) => {
      return [
        { cmd: steps.pull(image, version), req: true},
        { cmd: steps.stopContainer(name), req: false },
        { cmd: steps.removeContainer(name), req: false },
        { cmd: steps.mountedStart(name, bind, image, version, volume), req: true }
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
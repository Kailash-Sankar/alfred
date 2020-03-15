// NOTE: this file should not be commited.

const dockerHub = 'dev-docker-hub:5043';
const configPath = '/tmp/build_config';

// general container configurations
const services = {
    app_server: {
        path: `${dockerHub}/dev/webapp_server`,
        name: 'app_server',
        bind: '0.0.0.0:7777:80',
        type: 'hub',
    },
    app_client: {
        path: `${dockerHub}/master/webapp_client`,
        name: 'app_client',
        bind: '0.0.0.0:9999:80',
        type: 'hub',
    },
    app_logger : {
        path: `/tmp/logger_repo`,
        name: 'app_logger',
        bind: '0.0.0.0:3000:80',
        type: 'local',
        df: 'logger.Dockerfile',
    }
};

// additional custom steps
const extraSteps = {
    if_server : [
        { cmd:`docker cp ${configPath}/default.yml if_server:/app/config/`, req: true },
        { cmd: 'docker exec -it bash -c "export NODE_ENV=development; pm2 restart all --update-env"', req: true}
    ]
}

module.exports = {services, extraSteps, configPath};
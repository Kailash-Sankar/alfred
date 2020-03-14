// NOTE: this file should not be commited.

const dockerHub = 'dev-docker-hub:5043';

// general container configurations
const services = {
    app_server: {
        path: `${dockerHub}/dev/webapp_server`,
        name: 'app_server',
        bind: '0.0.0.0:7777:80'

    },
    app_client: {
        path: `${dockerHub}/master/webapp_client`,
        name: 'app_client',
        bind: '0.0.0.0:9999:80'
    },
};

// additional custom steps
const extraSteps = {
    app_server : [
        'docker cp /tmp/muffins/ app_server:/app/config/',
        'docker exec -it bash -c "export NODE_ENV=development; pm2 restart all --update-env"',
    ]
}

module.exports = {services, extraSteps};
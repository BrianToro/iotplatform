'use strict'

const db = require('../')

async function run() {
    const config = {
        database: process.env.DB_NAME || 'iotplatform',
        username: process.env.DB_USER || 'briandev',
        password: process.env.DB_PASS || '12345678',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
    }

    try {

        const { Agent, Metric } = await db({ config })

        const agent = await Agent.createOrUpdate({
            uuid: 'yyy',
            name: 'test',
            username: 'test',
            hostname: 'test',
            pid: 1,
            connected: true
        })

        console.log('--------------agent--------------');
        console.log(agent);

        const agents = await Agent.findAll()

        console.log('--------------agents--------------');
        console.log(agents);

        const metrics = await Metric.findByAgentUuid('yyy')

        console.log('--------------metrics--------------');
        console.log(metrics);

        const metric = await Metric.create('yyy', {
            type: 'memory',
            value: '30000'
        })

        console.log('--------------metric--------------');
        console.log(metric);

        const metricsByType = await Metric.findByTypeAgentUuid('memory', 'yyy')

        console.log('--------------metricsByType--------------');
        console.log(metricsByType);

    } catch (e) {
        console.error(e.message)
        console.error(e.stack)
        process.exit(1)
    }
}

run()
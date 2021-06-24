'use strict'

const agentFixtures = require('./agent')

const metric = {
    id: 1,
    type: 'cpu',
    value: 20,
    agentId: 1,
}

function extend(obj, values) {
    return {
        ...obj,
        ...values
    }
}

const metrics = [
    metric,
    extend(metric, { id: 2, type: 'rom', value: '10', agentId: 2 }),
    extend(metric, { id: 3, type: 'ram', value: '30', agentId: 3 }),
    extend(metric, { id: 4, type: 'disk', value: '100', agentId: 4 })
]

module.exports = {
    single: metric,
    all: metrics,
    byAgentUuid: uuid => {
        const agent = agentFixtures.byUuid(uuid)

        if (agent){
            return metrics
                .filter(m => agent.id === m.agentId)
                .map(m => m.type)
        }
        return []
    },
    byTypeAgentUuid: (type, id) => {
        let metricFound = metrics.find(a => id === a.agentId && type === a.type)
        metricFound.agentId = agentFixtures.single
        return 
    }
}

'use strict'

module.exports = (MetricModel, AgentModel) => {
  async function create(uuid, metric) {
    const agent = await AgentModel.findOne({
      where: { uuid }
    })

    if (agent) {
      metric = { ...metric, agentId: agent.id }
      const result = await MetricModel.create(metric)
      return result
    }
  }

  async function findByAgentUuid(uuid) {
    return MetricModel.findAll({
      attributes: ['type'],
      group: ['type'],
      include: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        }
      }],
      raw: true
    })
  }

  async function findByTypeAgentUuid(type, uuid) {
    return MetricModel.findAll({
      attributes: ['id', 'type', 'value', 'createdAt'],
      where: {
        type
      },
      limit: 20,
      order: [['createdAt', 'DESC']],
      includes: [{
        attributes: [],
        model: AgentModel,
        where: {
          uuid
        },
        raw: true
      }]
    })
  }

  return {
    create,
    findByAgentUuid,
    findByTypeAgentUuid
  }
}

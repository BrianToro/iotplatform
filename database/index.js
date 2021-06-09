'use strict'

const defaults = require('defaults')
const setUpDB = require('./lib/database')
const setUpModelAgent = require('./models/agent')
const setUpModelMetric = require('./models/metric')
const setUpAgent = require('./lib/agent')

module.exports = async ({ config }) => {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    },
    query: {
      raw: true
    }
  })

  // @INFO: Set up base de datos
  const sequelize = setUpDB({ config })

  // @INFO: Set up modelos
  const AgentModel = setUpModelAgent({ config })
  const MetricModel = setUpModelMetric({ config })

  // @INFO: Relaciones
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  // @INFO: Base de datos validaciones
  await sequelize.authenticate()

  if (config.setup) {
    await sequelize.sync({ force: true })
  }
  const Agent = setUpAgent(AgentModel)
  const Metric = {}
  return {
    Agent,
    Metric
  }
}

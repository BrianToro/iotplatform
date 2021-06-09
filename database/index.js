'use strict'

const setUpDB = require('./lib/database')
const setUpModelAgent = require('./models/agent')
const setUpModelMetric = require('./models/metric')

module.exports = async ({ config }) => {
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
  const Agent = {}
  const Metric = {}
  return {
    Agent,
    Metric
  }
}

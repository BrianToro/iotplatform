'use strict'

const Sequelize = require('sequelize')
const setUpDB = require('../lib/database')

module.exports = ({ config }) => {
  const sequelize = setUpDB({ config })
  return sequelize.define('metric', {
    type: { type: Sequelize.STRING, allowNull: false },
    value: { type: Sequelize.TEXT, allowNull: false }
  })
}

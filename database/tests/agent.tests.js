'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const agentFixtures = require('./fixtures/agent')

const config = {
  logging: function () {}
}
let db = null
let sandBox = null

let single = { ...agentFixtures.single }
let MetricStub = {
  belongsTo: sinon.spy()
}
let uuid = 'yyyy-yyyy-yyyy'
let AgentStub
let id = 1
let uuidArgs = {
  where: {
    uuid,
  }
}

test.beforeEach(async () => {
  sandBox = sinon.createSandbox()
  AgentStub = {
    hasMany: sandBox.spy(),
    findById: sandBox.stub(),
    update: sandBox.stub(),
    create: sandBox.stub(),
    findOne: sandBox.stub(),
  }
  AgentStub.findById.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))
  AgentStub.update.withArgs(single, uuidArgs).returns(Promise.resolve(single))
  AgentStub.create.withArgs(id).returns(Promise.resolve(agentFixtures.byId(id)))
  AgentStub.findOne.withArgs(uuidArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))

  const setUpDB = proxyquire('../', {
    './models/agent': () => AgentStub,
    './models/metric': () => MetricStub
  })
  db = await setUpDB({ config })
})

test.afterEach(t => {
  sandBox && sandBox.restore()
})

test('Agent', t => {
  t.truthy(db.Agent, 'Agent service should exist')
})

test.serial('SetUp', t => {
  t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
  t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be MetricStub')
  t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
  t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be AgentStub')
})

test.serial('Agent#findById', async t => {
  let agent = await db.Agent.findById(id)

  t.true(AgentStub.findById.called, 'findById should be called on model')
  t.true(AgentStub.findById.calledOnce, 'findById should be called once')
  t.true(AgentStub.findById.calledWith(id), 'findById should be called with this argument')
  t.deepEqual(agent, agentFixtures.byId(id), 'should be the same')
})

test.serial('Agent#createOrUpdate', async t => {
  let agent = await db.Agent.createOrUpdate(single)

  t.true(AgentStub.findOne.called, 'findOne should be called')
  t.true(AgentStub.findOne.calledTwice, 'findOne should be called twice')
  t.true(AgentStub.update.calledOnce, 'findOne should be called once')
  t.deepEqual(agent, single, 'agent should be the same')
})

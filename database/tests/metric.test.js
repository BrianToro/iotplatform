'use strict'

const test = require('ava')
const sinon = require('sinon')
const proxyquire = require('proxyquire')
const metricFixture = require('./fixtures/metric')
const agentFixtures = require('./fixtures/agent')

const config = {
    logging: function () { }
}
let db = null
let sandBox = null
const AgentStub = {
    hasMany: sinon.spy(),
    findOne: sinon.stub()
}
let MetricStub

const single = { ...metricFixture.single }
const uuid = 'yyyy-yyyy-yyyy'
const findOneArgs = {
    where: { uuid }
}


test.beforeEach(async () => {
    AgentStub.findOne.withArgs(findOneArgs).returns(Promise.resolve(agentFixtures.byUuid(uuid)))
    sandBox = sinon.createSandbox()
    MetricStub = {
        belongsTo: sandBox.spy(),
        create: sandBox.stub(),
        findAll: sandBox.stub(),
    }
    MetricStub.create.withArgs(metricFixture.single).returns(Promise.resolve(metricFixture.single))



    const setUpDB = proxyquire('../', {
        './models/agent': () => AgentStub,
        './models/metric': () => MetricStub
    })
    db = await setUpDB({ config })
})

test.afterEach(t => {
    sandBox && sandBox.restore()
})

test('Metric', t => {
    t.truthy(db.Metric, 'Metric service should exist')
})

test.serial('SetUp', t => {
    t.true(AgentStub.hasMany.called, 'AgentModel.hasMany was executed')
    t.true(AgentStub.hasMany.calledWith(MetricStub), 'Argument should be MetricStub')
    t.true(MetricStub.belongsTo.called, 'MetricStub.belongsTo was executed')
    t.true(MetricStub.belongsTo.calledWith(AgentStub), 'Argument should be AgentStub')
})

test.serial('Metric#create', async t => {
    const metric = await db.Metric.create(uuid, single)

    t.true(AgentStub.findOne.called, 'AgentStub should be called')
    t.true(MetricStub.create.called, 'Metric should be called')
    t.deepEqual(metric, single, 'metric should be the same')
})

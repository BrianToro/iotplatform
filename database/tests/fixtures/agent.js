'use strict'

const agent = {
  id: 1,
  uuid: 'yyyy-yyyy-yyyy',
  name: 'fixture',
  username: 'fixture',
  hostname: 'fixture',
  pid: 0,
  connected: true,
  createdAt: new Date(),
  updatedAt: new Date(),
}

function extend (obj, values) {
  return {
    ...obj,
    ...values
  }
}

const agents = [
  agent,
  extend(agent, { id: 2, uuid: 'xxxx-xxxx-xxxx', connected: false }),
  extend(agent, { id: 3, uuid: 'xxxx-xxxx-xxxw', connected: false, username: 'fixture-2' }),
  extend(agent, { id: 4, uuid: 'xxxx-xxxx-xxxz', connected: true, username: 'fixture-2' })
]

module.exports = {
  single: agent,
  all: agents,
  connected: agents.filter(a => a.connected),
  fixture: agents.filter(a => a.username === 'fixture'),
  byUuid: id => agents.find(a => id === a.uuid),
  byId: id => agents.find(a => id === a.id)
}
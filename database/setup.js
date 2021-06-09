'use strict'

const debug = require('debug')('iotplatform:database:setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([{
    type: 'confirm',
    name: 'setup',
    message: 'This will destroy your database, are you sure?'
  }])

  if (!answer.setup) {
    return console.log('')
  }

  const config = {
    database: process.env.DB_NAME || 'iotplatform',
    username: process.env.DB_USER || 'briandev',
    password: process.env.DB_PASS || '12345678',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    setup: true,
    logging: message => debug(message)
  }

  await db({ config }).catch(handleFatalError)
  console.log('success connection')
  process.exit(0)
}

const handleFatalError = (err) => {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

setup()

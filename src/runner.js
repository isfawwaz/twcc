const chalk = require('chalk')
const Listr = require('listr')
const ConvertTo = require('./index')
const path = require('path')

const error = (msg) => chalk.bold.bgRed('\n' + chalk.white(msg) + '\n')
const log = console.log

const task = new Listr([
  {
    title: 'Setup converter',
    task: async (ctx) => {
      const argv = ctx.argv
      try {
        ctx.converter = new ConvertTo({
          config: path.join(process.cwd(), argv.config),
          destination: argv.destination,
          format: argv.format,
          prefix: argv.prefix,
          flat: argv.flat,
          quotedKeys: argv['quoted-keys'],
          flattenMapsAfter: argv['flatten-maps-after'],
          preserveKeys: argv['preserve-keys'],
          onlyIncludeKeys: argv['only-include-keys']
        })
      } catch (e) {
        log(error(e.message))
        return Promise.reject(e)
      }
    }
  },
  {
    title: 'Exporting config',
    task: async (ctx) => {
      try {
        ctx.converter
          .writeToFile()
          .then((options) => {
            log(
              chalk.bold.bgGreen(`\n Config file written successfully to ${options.destination} `)
            )
          })
          .catch((e) => {
            log(error(e.message))
          })
      } catch (e) {
        log(error(e.message))
        return Promise.reject(e)
      }
    }
  }
])

async function run (argv) {
  await task.run({
    argv
  })
}

module.exports = run

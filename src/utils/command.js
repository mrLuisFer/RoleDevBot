const prefix = require("./prefix")

module.exports = (client, aliases, callback) => {
  if (typeof aliases === "string") {
    aliases.toLowerCase()
    aliases = [aliases]
  }

  client.on("message", (message) => {
    const { content } = message

    const contentLower = content.toLowerCase()

    aliases.forEach((alias) => {
      const command = `${prefix}${alias}`

      const commandLower = command.toLowerCase()

      if (
        contentLower.startsWith(`${commandLower} `) ||
        contentLower === commandLower
      ) {
        // console.log(`Running the command ${commandLower}`)
        callback(message)
      }
    })
  })
}

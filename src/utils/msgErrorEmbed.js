const { MessageEmbed } = require("discord.js")

const colors = require("./colors")

function setErrorEmbed(messageInfo, solutionText = "") {
  let solutionAccept = ""

  if (solutionText.length > 0) {
    solutionAccept = `✅Solucion: ${solutionText}`
  }

  const embed = new MessageEmbed()
    .setColor(colors.red)
    .setTitle("Error")
    .setThumbnail("https://media.giphy.com/media/26xBtkkKAbDwkkU9i/giphy.gif")
    .setDescription(`
      ❌Error: ${messageInfo}
      
      ${solutionAccept}
      `)

  return embed
}

module.exports = setErrorEmbed

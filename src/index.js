"use strict"

const { Client, Role, MessageEmbed } = require("discord.js")
require("dotenv").config()

// class instances
const client = new Client()
const role = new Role()

// utils
const colors = require("./utils/colors")
const command = require("./utils/command")
const autorole = require("./utils/autorole")

client.on("ready", () => {
  console.log(`Bot is ready as ${client.user.username}`)
  client.user.setStatus("online")

  command(client, ["help", "h"], async (message) => {
    await message.react("😉")

    const embed = new MessageEmbed()
      .setAuthor(message.channel.guild.name, message.guild.iconURL())
      .setTitle("🧠 Ayuda?")
      .setColor(colors[6])
      .setThumbnail("https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif")
      .setFooter(
        `
        Los comandos siguen en construccion asi que los comandos pueden cambiar en el futuro ;)
      `
      )
      .setDescription(
        `
      **_help**  mostrara los comandos existentes en el bot

      **_avatar** mostrara la foto y id de tu perfil

      **_members** mostrara el total de miembros del servidor

      **_cc** **_clear** limpiara los mensajes de un canal que tengan menos de 2 semanas, solo si eres _Administrador_
      
      **_serverinfo** te muestra informacion basica del servidor que podria interesarte

      **_status _someText_** colocara el estatus del bot dependiendo del texto que coloques al lado del comando
      `
      )

    message.channel.send(embed)
  })

  command(client, "members", (message) => {
    client.guilds.cache.forEach((guild) => {
      const embed = new MessageEmbed()
        .setAuthor(guild.name)
        .setDescription(`Tenemos un total de ${guild.memberCount} miembros! :D`)
        .setThumbnail("https://media.giphy.com/media/aFTt8wvDtqKCQ/giphy.gif")
        .setColor(colors[3])
      message.channel.send(embed)
    })
  })

  command(client, "avatar", (message) => {
    const avatarUrl = message.author.displayAvatarURL()
    const embed = new MessageEmbed()
      .setThumbnail(avatarUrl)
      .setTitle("Este es tu avatar")
      .setAuthor(`${message.member.displayName}`, `${avatarUrl}`)
      .setColor(colors[0])
      .setDescription(`id: ${message.author.id}`)

    message.channel.send(embed)
  })

  command(client, ["cc", "clear"], (message) => {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
      })
    }
  })

  command(client, "status", (message) => {
    const content = message.content.replace("_status ", "")

    client.user.setPresence({
      activity: {
        name: content,
        type: 0,
      },
    })
  })

  command(client, "serverinfo", (message) => {
    const { guild } = message

    const { name, region, memberCount, owner, afkTimeout } = guild
    const icon = guild.iconURL()

    const embed = new MessageEmbed()
      .setTitle(`Informacion de: ${name}`)
      .setThumbnail(icon)
      .addFields(
        {
          name: "Region",
          value: region,
        },
        {
          name: "Miembros",
          value: memberCount,
        },
        {
          name: "Owner",
          value: owner.user.tag,
        },
        {
          name: "Tiempo AKF",
          value: afkTimeout,
        }
      )

    message.channel.send(embed)
  })

  autorole(client)
})

// Messages for the channel
client.on("message", (message) => {
  if (message.author === client.user) return
})

// the client login to the bot
client.login(`${process.env.TOKEN}`)

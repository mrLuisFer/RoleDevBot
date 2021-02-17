"use strict"

const { Client, MessageEmbed } = require("discord.js")
require("dotenv").config()

// class instances
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
})

// utils
const colors = require("./utils/colors")
const command = require("./utils/command")
const setErrorEmbed = require("./utils/msgErrorEmbed")
// require fetch since for some reason, by default it detects it as undefined
const fetch = require("node-fetch")

// Commands
client.on("ready", () => {
  console.log(`Bot is ready as ${client.user.username}`)
  client.user.setStatus("online")
  // handles the maximum available event or command listener
  client.setMaxListeners(20)

  command(client, ["help", "h"], async (message) => {
    await message.react("😉")

    const embed = new MessageEmbed()
      .setAuthor(message.channel.guild.name, message.guild.iconURL())
      .setTitle("🧠 Ayuda?")
      .setColor(colors.orange)
      .setImage("https://media.giphy.com/media/ZVik7pBtu9dNS/giphy.gif")
      .setFooter(
        `
        Los comandos siguen en construccion asi que los comandos pueden cambiar en el futuro ;)
      `
      )
      .setDescription(
        `
      **_help  _h**  mostrara los comandos existentes en el bot

      **_avatar** mostrara la foto y id de tu perfil

      **_members** mostrara el total de miembros del servidor

      **_cc**  **_clear** limpiara los mensajes de un canal que tengan menos de 2 semanas, solo si eres _Administrador_
      
      **_serverinfo** te muestra informacion basica del servidor que podria interesarte

      **_status  _someText_** colocara el estatus del bot dependiendo del texto que coloques al lado del comando
      
      **_repo  _repository** te mostrara el mensaje del repositorio

      **_npm  _someModule_** te mostrara informacion basica de algun modulo de npm

      **_wiki  _someText_** te devolvera una pequeña definicion del texto que coloques

      **_bot** te da informacion basica acerca del Bot
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
        .setColor(colors.green)
      message.channel.send(embed)
    })
  })

  command(client, "avatar", (message) => {
    const avatarUrl = message.author.displayAvatarURL()
    const embed = new MessageEmbed()
      .setThumbnail(avatarUrl)
      .setTitle("Este es tu avatar")
      .setAuthor(`${message.member.displayName}`, `${avatarUrl}`)
      .setColor(colors.cream)
      .setDescription(`id: ${message.author.id}`)

    message.channel.send(embed)
  })

  command(client, ["cc", "clear"], (message) => {
    if (message.member.hasPermission("ADMINISTRATOR")) {
      message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
      })
    } else {
      const solution =
        "Si quieres eliminar algun mensaje hazlo manualmente o habla con algun ADMIN para revisar que es lo que necesitas"
      const error = setErrorEmbed(
        "No tienes permiso para eliminar el chat >:I",
        solution
      )
      message.channel.send(error)
    }
  })

  command(client, "status", (message) => {
    const content = message.content.replace("_status ", "")

    if (content === "_status") {
      message.channel.send(
        "Por favor coloca un estado que quieres que este el Bot ;)"
      )
    } else {
      client.user.setPresence({
        activity: {
          name: content,
          type: 0,
        },
      })
    }
  })

  command(client, "serverinfo", (message) => {
    const { guild } = message

    const { name, region, memberCount, owner, afkTimeout } = guild
    const icon = guild.iconURL()

    const embed = new MessageEmbed()
      .setTitle(`Informacion de: ${name}`)
      .setThumbnail(icon)
      .setColor(colors.wine)
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

  command(client, "npm", async (message) => {
    const content = message.content.replace("_npm ", "")

    const getData = async (text) => {
      const response = await fetch(`https://api.npms.io/v2/package/${text}`)
      const data = await response.json()

      return data
    }

    const info = await getData(content)
    // console.log(info)

    // A little validate to send the message
    if (
      info !== null &&
      info !== undefined &&
      info.collected !== undefined &&
      info.collected.metadata !== undefined
    ) {
      const embed = new MessageEmbed()
        .setAuthor(
          "npm",
          "https://pbs.twimg.com/profile_images/1285630920263966721/Uk6O1QGC_400x400.jpg"
        )
        .setTitle(`📦Package: ${info.collected.metadata.name}`)
        .addFields(
          {
            name: "Version:",
            value: `${info.collected.metadata.version}`,
          },
          {
            name: "Description:",
            value: `${info.collected.metadata.description}`,
          },
          {
            name: "📜License:",
            value: `${info.collected.metadata.license}`,
          }
        )
        .setFooter(
          `Link: ${
            info.collected.github?.homepage !== undefined
              ? info.collected.github?.homepage
              : info.collected.metadata.links?.homepage
          }`
        )
        .setColor(colors.yellow)
        .setThumbnail(
          "https://media.giphy.com/media/gHnBLyeYE6hboT3t3o/giphy.gif"
        )

      message.channel.send(embed)
    } else if (info.code === "NOT_FOUND" || info.code === "INVALID_PARAMETER") {
      // This send a simple error message
      const solution =
        "Revisa que hayas escrito bien el nombre del paquete o si pusiste un espacio cambialo por un **-**"
      const error = setErrorEmbed("Modulo no encontrado", solution)
      message.channel.send(error)
    }
  })

  command(client, ["repo", "repository"], (message) => {
    const embed = new MessageEmbed()
      .setAuthor(
        "Github",
        "https://image.flaticon.com/icons/png/512/25/25231.png"
      )
      .setColor(colors.black)
      .setDescription(
        `
        Revisa el codigo y puedes unirte para aprender o mejorar el codigo del Bot 🤖
        
        Puedes hacer tus **pull request** y con gusto sera revisado para unirlo al codigo 🧠
        
        **Link:** https://github.com/mrLuisFer/RoleDevBot
        `
      )
      .setThumbnail(
        "https://media.giphy.com/media/dxn6fRlTIShoeBr69N/giphy.gif"
      )

    message.channel.send(embed)
  })

  command(client, ["yei", "yay"], async (message) => {
    await message.react("😁")

    const embed = new MessageEmbed()
      .setAuthor(message.channel.guild.name, message.guild.iconURL())
      .setTitle("Don't worry Be happy! 😄")
      .setImage("https://media.giphy.com/media/13hxeOYjoTWtK8/giphy.gif")
      .setColor(colors.yellow)

    message.channel.send(embed)
  })

  command(client, "wiki", async (message) => {
    const content = message.content.replace("_wiki ", "")

    const getData = async (text) => {
      const response = await fetch(`
    https://es.wikipedia.org/w/api.php?action=query&list=search&srprop=snippet&format=json&origin=*&utf8=&srsearch=${text}
      `)
      const data = await response.json()

      return data
    }

    const info = await getData(content)

    // A little validate to send the message
    if (
      info !== null &&
      info !== undefined &&
      info.query !== undefined &&
      info.query.search !== undefined
    ) {
      const firstResult = info?.query.search[0]
      // console.log(firstResult)

      if (firstResult !== undefined || firstResult !== null) {
        try {
          const snippetText = firstResult.snippet.replace(/<[^>]*>/g, "")
          const embed = new MessageEmbed()
            .setAuthor(
              "Wikipedia",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Wikipedia-logo-v2-es.svg/1200px-Wikipedia-logo-v2-es.svg.png"
            )
            .setTitle(`- ${firstResult.title}`)
            .setDescription(
              `
            ${snippetText}...
            
            Conocer mas: https://es.wikipedia.org/wiki/${content}
            `
            )
            .setColor(colors.white)
            .setThumbnail(
              "https://media.giphy.com/media/cQ23bDqzbWbh240xQq/giphy.gif"
            )

          message.channel.send(embed)
        } catch (error) {
          console.log(error)
        }
      }
    } else {
      message.channel.send("Informacion no encontrada en la Wikipedia :(")
    }
  })

  command(client, "bot", async (message) => {
    await message.react("🤖")

    // console.log(client.user)

    // Get the guild info of the server
    const { guild } = message
    const { name } = guild
    const icon = guild.iconURL()

    // Get the info to bot data
    const { username, bot, id, verified, tag } = client.user

    const embed = new MessageEmbed()
      .setAuthor(name, icon)
      .setColor(colors.orange)
      .setDescription(
        `
        Username: **${username}**

        Bot: **${bot}**

        Id: **${id}**

        Verified: **${verified}**
      
        Discord: ${tag}
        `
      )
      .setThumbnail(`${client.user.avatarURL()}`)
      .setFooter(`Beep Boop, Boop Beep`)
    message.channel.send(embed)
  })

  command(client, "rules", (message) => {
    if (
      message.channel.name === "📖reglas" ||
      message.channel.id === "807084131678027777"
    ) {
      const { guild } = message
      const { name } = guild
      const icon = guild.iconURL()

      const embed = new MessageEmbed()
        .setAuthor(name, icon)
        .setTitle("⚠ - Reglas del Servidor")
        .setColor(colors.green)
        .setFooter(
          "Sino estas de acuerdo con alguna regla o crees poder mejorar alguna solo comentala en el canal de sugerencias"
        ).setDescription(`
        \n 
          ✅ Permitido:

          - **Respeta** Se cordial, respetuoso y amable con todas y todos los miembros de este servidor
          
          - **Se Ordenado** Respeta las tematicas de cada canal para asi tener un mejor manejo de todo el servidor

          - **Comparte** Recuerda que el objetivo de este servidor es que todos aprendan, asi que no olvides compartir de la mejor manera los conociminetos que tengas acerca de un tema

          - **Seguridad** Si llegas a resivir algun tipo de acoso o insulto de alguno de los miembros de este servidor, comentalo y con gusto te ayudaremos personalmente para solucionarlo

          - **Ayuda?** Puedes pedir ayuda para proyectos o dudas de cualquier sector de TI que tengas, solo recuerda ser respetuoso

          - **Opiniones** La idea de compartir tus conocimientos es para crecer profesionalmente y por lo tanto aceptar opiniones, siempre y cuando sean con respeto y ayuden de verdad

          - **Sugerencias?** Claro!, se aceptan cualquier tipo de sugerencia relevante al servidor o al manejo de este, tambien puedes aportar tus ideas para mejorarlo o hacerlo crecer 

          - **Colaboraciones** Puedes compartir algun proyecto o idea que quieras realizar para colaborar con mas personas de cualquier sector y asi aprender todos juntos

        `)

      const embedErrors = new MessageEmbed()
        .setDescription(
          `
          \n
          ❌ No Permitido:
          - **No contenido NSFW**  No compartas ese tipo de contenido en el servidor, trata de ser mas profesional asi las personas sabran en quien confiar para su proximo proyecto

          - **Contenido Ilegal** No se permitira contenido ilegal, comprar los recursos o libros ayuda mas a sus creadores o autores

          - **No Spam**  No se tolerara el spam abusivo o fuera de lugar o inapropiado

          - **Opiniones** No se aceptaran opiniones idealistas, religiosas, racistas o politicas esas se respetan y se quedan contigo
      `
        )
        .setAuthor(name, icon)
        .setColor(colors.red)

      const embedExtras = new MessageEmbed()
        .setDescription(
          `
          \n
          ℹ Extras:

          - **Roles?** Puedes tomar los roles permitidos en la seccion de roles que esta configurado con nuestro bot

          - **Puedo ser Mod o Admin?** Claro, pidelo por el canal de general y alguno de nuestros Admins revisara tu perfil y verificara que se te de el rol ;)

          - **Talleres?** Puedes compartir algun taller o clase con quienes gusten asistir por alguno de nuestros canales de voz

          - **Ayuda en Codigo** Si requieres ayuda con el codigo recuerda mandar alguna captura del error o escribir el codigo por medio de  backticks

          **Estas de acuerdo?** Si estas de acuerdo con estas simples reglas, solo disfruta del servidor, aprende mucho mas y conoce a personas que pueden ser tus proximos amigos :D
         `
        )
        .setAuthor(name, icon)
        .setColor(colors.yellow)

      message.channel.send(embed)
      message.channel.send(embedErrors)
      message.channel.send(embedExtras)
    } else {
      const error = setErrorEmbed(
        "El comando de _rules solo aparecera en el canal de **reglas**"
      )

      message.channel.send(error)
    }
  })

  command(client, "greet", async (message) => {
    const text = message.content.replace("_greet", "")

    if (text.length < 0 || text === undefined || text === null) {
      const error = setErrorEmbed(
        "No has colocado a una persona a quien saludar :(",
        "Por favor coloca a un usuario"
      )

      message.channel.send(error)
    } else {
      const { guild } = message
      const icon = guild.iconURL()

      let userMentioned = message?.mentions.users.first()

      try {
        const res = await fetch("https://api.github.com/users/callMe-Dev/repos")
        const data = await res.json()

        console.log(data)

        let userId = `<@${userMentioned.id}>`

        const embed = new MessageEmbed()
          .setTitle(`${userMentioned.username} Bienvenid@🌟`, icon)
          .setColor(colors.lemon)
          .setThumbnail(userMentioned.avatarURL())
          .setDescription(
            `
          Bienvenido ${userId}

          Proyectos Activos:
          
          ${data.map((repo) => repo.name)}
          `
          )
          .setFooter("Happy Coding🐞", icon)
          .setImage(
            "https://media.giphy.com/media/3o6ZtpxSZbQRRnwCKQ/giphy.gif"
          )

        message.channel.send(embed)
      } catch (error) {
        console.log(error)
      }
    }
  })
})

// Messages for the channel
client.on("message", (message) => {
  // Validate to the messages isn't from the bot
  if (message.author === client.user) return
  if (message.author.bot) return
})

// Roles
const frontend = "807113403109212160"
const backend = "807114218896752661"
const designer = "807283516403875922"
const gameDev = "807115080025112587"
const deskDev = "807114734364524564"
const fullstack = "807114546207522876"
const mobileDev = "807114369129250868"

const messageId = "807487122407030784"
// Message Id

client.on("messageReactionAdd", (reaction, user) => {
  const { name } = reaction.emoji
  const member = reaction.message.guild.members.cache.get(user.id)

  // console.log(name)

  if (reaction.message.id === messageId) {
    switch (name) {
      case "javascript":
        member.roles.add(`${frontend}`)
        break
      case "php":
        member.roles.add(`${backend}`)
        break
      case "css3":
        member.roles.add(`${designer}`)
        break
      case "video_game":
        member.roles.add(`${gameDev}`)
        break
      case "desktop":
        member.roles.add(`${deskDev}`)
        break
      case "nodejs":
        member.roles.add(`${fullstack}`)
        break
      case "mobiledeveloper":
        member.roles.add(`${mobileDev}`)
        break
    }
  }
})

client.on("messageReactionRemove", (reaction, user) => {
  const { name } = reaction.emoji
  const member = reaction.message.guild.members.cache.get(user.id)

  if (reaction.message.id === messageId) {
    switch (name) {
      case "javascript":
        member.roles.remove(frontend)
        break
      case "php":
        member.roles.remove(backend)
        break
      case "css3":
        member.roles.remove(designer)
        break
      case "video_game":
        member.roles.remove(gameDev)
        break
      case "desktop":
        member.roles.remove(deskDev)
        break
      case "nodejs":
        member.roles.remove(fullstack)
        break
      case "mobiledeveloper":
        member.roles.remove(mobileDev)
        break
    }
  }
})

// the client login to the bot
client.login(`${process.env.TOKEN}`)

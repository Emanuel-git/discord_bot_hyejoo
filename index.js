const express = require('express')
const app = express()

// app.get("/", (request, response) => {
//     const ping = new Date()
//     ping.setHours(ping.getHours() - 3)

//     console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`)
//     response.sendStatus(200)
// })

// app.listen(process.env.PORT) // Recebe solicitações que o deixam online

const Discord = require("discord.js") // Conexão com a biblioteca Discord.js
const client = new Discord.Client() // Criação de um novo Client
const config = require("./config.json") // Pegando o token e o prefixo do bot para respostas de comandos

client.on("message", message => {
    if (message.author.bot) return
    if (message.channel.type == "dm") return
    if (!message.content.toLowerCase().startsWith(config.prefix)) return
    // if (message.content.startsWith(`<@!${client.user.id}>`)) || message.content.startsWith(`<@${client.user.id}>`) return

    const args = message.content
        .trim()
        .slice(config.prefix.length)
        .split(/ +/g)

    console.log(args)

    const cmd = args.shift().toLowerCase()

    try {
        const cmdFile = require(`./commands/${cmd}.js`)
        cmdFile.run(client, message, args)
    }
    catch (e) {
        return
    }
})

client.login(config.TOKEN) // Ligando o bot caso ele consiga acessar o token
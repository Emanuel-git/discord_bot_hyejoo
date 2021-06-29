const express = require('express')
const app = express()

const Discord = require("discord.js") // Conexão com a biblioteca Discord.js
const client = new Discord.Client() // Criação de um novo Client
const config = require("./config.json") // Pegando o token e o prefixo do bot para respostas de comandos

app.listen(config.PORT) // Recebe solicitações que o deixam online

app.get("/", (request, response) => {
    const ping = new Date()
    ping.setHours(ping.getHours() - 3)

    console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`)
    response.sendStatus(200)
})

client.on('ready', () => {
    console.log('Conectado ao servidor discord')
    client.user.setActivity('[MV] 이달의 소녀 (LOONA) "PTT (Paint The Town)"', { type: 'WATCHING' })
})

client.on("guildMemberAdd", member => {
    
})

client.on("message", message => {
    if (message.author.bot) return
    if (message.channel.type == "dm") console.log(message.author.username + ": " + message.content)
    if (!message.content.toLowerCase().startsWith(config.prefix)) return
    console.log("message.content: " + message.content)

    const args = message.content
        .trim()
        .slice(config.prefix.length)
        .split(/ +/g)
    console.log("args: " + args)

    const cmd = args.shift().toLowerCase()
    console.log('command: ' + cmd)
    console.log('args: ' + args)

    try {
        const cmdFile = require(`./commands/${cmd}.js`)
        cmdFile.run(client, message, args)
    }
    catch (e) {
        message.channel.send('> Erro: ' + e)
    }
})

client.login(config.TOKEN) // Ligando o bot caso ele consiga acessar o token
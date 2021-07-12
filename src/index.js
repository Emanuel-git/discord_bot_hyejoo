const express = require('express')
const app = express()
const Discord = require("discord.js") // Conexão com a biblioteca Discord.js
const client = new Discord.Client() // Criação de um novo Client
const config = require("./JSONfiles/config.json") // Pegando o token e o prefixo do bot para respostas de comandos
const fs = require('fs')

app.listen(config.PORT) // Recebe solicitações que o deixam online

app.get("/", (request, response) => {
    const ping = new Date()
    ping.setHours(ping.getHours() - 3)

    console.log(`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`)
    response.sendStatus(200)
})

const servers = []; exports.servers = servers

client.on('guildCreate', guild => {
    console.log('Id da guilda onde eu entrei: ' + guild.id)
    console.log('Nome da guilda onde eu entrei: ' + guild.name)

    servers[guild.id] = {
        connection: null,
        dispatcher: null,
        queue: [],
        isPlaying: false
    }

    saveServer(guild.id)
})

client.on('ready', () => {

    loadServers()

    console.log('Hyejoo conectada ao servidor discord')

})

client.on('guildMemberAdd', member => {
    const embed = new Discord.MessageEmbed()
        .setColor('#0000ff')
        .setTitle(`Bem vindo, ${member.user.username}#${member.user.discriminator}`)
        .setAuthor(member.guild.name, `https://cdn.discordapp.com/icons/${member.guild.id}/${member.guild.icon}.png`)
        .setThumbnail(
            member.user.avatar
            ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`
            : `https://cdn.discordapp.com/embed/avatars/${member.user.discriminator % 5}.png`
            )
        .addFields({
            name: 'Você é o membro nº',
            value: member.guild.memberCount,
            inline: true
        })
        .setTimestamp()
    
    const a = member.guild.channels.cache.get('861423679920930816')
    console.log(a.name)
    a.send(embed)
})

client.on('message', message => {
    if (message.author.bot) return
    if (message.channel.type == "dm") {
        console.log(message.author.username + ": " + message.content)
        return
    } 
    if (!message.content.toLowerCase().startsWith(config.PREFIX)) return
    // console.log("message.content: " + message.content)

    const args = message.content
        .trim()
        .slice(config.PREFIX.length)
        .split(/ +/g)
    // console.log("args: " + args)

    const cmd = args.shift().toLowerCase()
    // console.log('command: ' + cmd)
    // console.log('args: ' + args)

    try {
        const cmdFile = require(`./commands/${cmd}.js`)
        cmdFile.run(client, message, args)
    }
    catch (e) {
        message.channel.send('> Não encontrei este comando :(')
    }
})

const loadServers = () => {
    fs.readFile('./src/JSONfiles/serverList.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        else {
            const objRead = JSON.parse(data)
            for (let i in objRead.servers) {
                servers[objRead.servers[i]] = {
                    connection: null,
                    dispatcher: null,
                    queue: [],
                    isPlaying: false
                }
            }
        }
    })
}

const saveServer = newServerId => {
    fs.readFile('./src/serverList.json', 'utf8', (err, data) => {
        if (err) console.log(err)
        else {
            const objRead = JSON.parse(data)
            objRead.servers.push(newServerId)
            const objWrite  = JSON.stringify(objRead)

            fs.writeFile('./src/serverList.json', objWrite, 'utf8', () => {})
        }
    })
}

client.login(config.TOKEN) // Ligando o bot caso ele consiga acessar o token
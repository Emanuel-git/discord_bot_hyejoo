const Discord = require('discord.js')
require('discord-reply')
const fs = require('fs')

const client = new Discord.Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    restTimeOffset: 0,
    restWsBridgetimeout: 100,
    disableEveryone: true,
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})

client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.categories = fs.readdirSync('./commands/')
client.cooldowns = new Discord.Collection()

client.handlers = ['command', 'events', 'distube-handler']

function handlers() {
    client.handlers.forEach(handler => {
        require(`./handlers/${handler}`)(client)
    })
}
handlers()

module.exports.handlers = handlers

client.login(require('./botConfig/config.json').TOKEN)
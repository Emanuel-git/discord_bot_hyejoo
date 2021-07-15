const Discord = require('discord.js')
const { servers } = require('..')

module.exports.run = async (client, message, args) => {
    servers[message.guild.id].queue = []
    servers[message.guild.id].dispatcher.end()
    message.member.voice.channel.leave()
    servers[message.guild.id].connection = null
    servers[message.guild.id].dispatcher = null
    servers[message.guild.id].playing = false
}
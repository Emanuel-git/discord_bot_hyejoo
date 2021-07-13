const Discord = require('discord.js')
const { servers } = require('..')

module.exports.run = async (client, message, args) => servers[message.guild.id].dispatcher.end()
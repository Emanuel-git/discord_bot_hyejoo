const Discord = require('discord.js')
const { servers } = require('..')

module.exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
        .setAuthor('Hyejoo')
        .setDescription('Fila:')

    for (let i in servers[message.guild.id].queue) {
        embed.addField(
            `${parseInt(i) + 1}. ${parseInt(i) === 0 ? '(playing now)' : ''} ${servers[message.guild.id].queue[i].name}`,
            servers[message.guild.id].queue[i].channel
        )
    }

    message.channel.send(embed)
}
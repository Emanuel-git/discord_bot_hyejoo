const Discord = require('discord.js')
const { servers } = require('..')

module.exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed()
    .setColor('#0000ff')
    .setAuthor('Hyejoo')
    .setDescription('Fila:')

    servers[message.guild.id].queue.forEach(song => {
        embed.addField(
            song.name,
            song.channel
            ) 
    });
    message.channel.send(embed)
}
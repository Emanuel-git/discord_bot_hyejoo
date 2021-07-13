const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    const user = message.mentions.users.first() || message.author
    const extension = user.avatar[1] === '_' ? '.gif' : '.png'
    const embed = new Discord.MessageEmbed()
        .setImage(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar + extension}?size=2048`)
    message.channel.send(embed)
}
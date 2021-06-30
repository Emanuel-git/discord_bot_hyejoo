const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    if (args[0].includes('<@')) args.shift() // '<@' means that the first item is a user mention, so we take it off
    let user = message.mentions.users.first() || message.author // if there is no mention, the dm is send to who run the command
    let msgToSend = args.join(' ')

    client.users.cache.get(user.id).send(msgToSend)
    message.delete().catch(m => {})
}
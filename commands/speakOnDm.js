const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    const speak = args.join(" ")
    message.delete().catch(m => {})
    message.author.send(speak)
}
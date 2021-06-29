const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    const reason = args.join(" ")
    message.delete().catch(m => {})
    message.channel.send(`> Sendo desligada por motivos de: ${reason}`)
    //client.off()
}
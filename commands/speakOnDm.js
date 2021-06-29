const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {

    const personToDm = args.shift().replace('<@!', '').replace('>', '')
    console.log(personToDm)
    const messageToDm = args.join(' ')
    console.log(messageToDm)

    client.users.cache.get(personToDm).send(messageToDm)
    //const speak = args.join(" ")
    message.delete().catch(m => {})
   // personToDm.send(speak)
}
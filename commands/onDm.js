const Discord = require("discord.js")

module.exports.run = async (client, message, args) => {
    
    if (args[0].includes('<@!')) {
        const personToDm = args.shift().replace('<@!', '').replace('>', '')
        console.log(personToDm)
        const messageToDm = args.join(' ')
        console.log(messageToDm)
    
        client.users.cache.get(personToDm).send(messageToDm)
        message.delete().catch(m => {})
    }
    else {
        message.delete().catch(m => {})
        message.channel.send("> Não consegui encontrar essa pessoa pra mandar dm")
    }
}
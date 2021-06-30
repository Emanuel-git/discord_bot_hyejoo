const Discord = require('discord.js')

module.exports.run = async (client, message, args) => {
    let user = message.mentions.users.first() || message.author 

    let img = user.avatarURL()

    if (user.avatar[1] === '_') { 
        /* I'm still testing but by now i think that
           if the avatar url has a "_" in the second char
           that means the avatar is a gif */ 

        img = user.avatarURL().replace('webp', 'gif')
    }

    console.log(img)
    message.channel.send(img)
}
const { MessageEmbed } = require('discord.js')
const config = require('../../botConfig/config.json')
const ee = require('../../botConfig/embed.json')
module.exports = {
    name: 'spotify',
    category: 'Information',
    aliases: [],
    cooldown: 2,
    usage: 'spotify <@user>',
    description: 'Shows info about spotify track that the user is listening.',
    run: async (client, message, args, cmduser, text, prefix) => {
        const user = message.mentions.users.first() || message.author

        const spotifyActivity = user.presence.activities.filter(activity => activity.name === 'Spotify')[0]

        if (spotifyActivity) {

            let trackIMG = `https://i.scdn.co/image/${spotifyActivity.assets.largeImage.slice(8)}`
            let trackURL = `https://open.spotify.com/track/${spotifyActivity.syncID}`
            let trackName = spotifyActivity.details
            let trackAuthor = spotifyActivity.state
            let trackAlbum = spotifyActivity.assets.largeText
    
            const embed = new MessageEmbed()
                .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png') 
                .setColor(0x1ED760)
                .setThumbnail(trackIMG)
                .addField('Song Name', trackName, true)
                .addField('Album', trackAlbum, true)
                .addField('Author', trackAuthor, false)
                .addField('Listen to track:', `[\`${trackURL}\`](trackURL)`, false)
    
            message.lineReplyNoMention(embed)
    
        } else {
            message.lineReplyNoMention(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setDescription('This user is not listening to spotify!')
        )
        }
    }
}
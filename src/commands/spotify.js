const Discord = require('discord.js')

module.exports.run = (client, message, args) => {

    const user = message.mentions.users.first() || message.author

    const spotifyActivity = user.presence.activities.filter(a => a.name === 'Spotify')[0]

    if (spotifyActivity) {

        let trackIMG = `https://i.scdn.co/image/${spotifyActivity.assets.largeImage.slice(8)}`
        let trackURL = `https://open.spotify.com/track/${spotifyActivity.syncID}`
        let trackName = spotifyActivity.details
        let trackAuthor = spotifyActivity.state
        let trackAlbum = spotifyActivity.assets.largeText

        const embed = new Discord.MessageEmbed()
            .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png') 
            .setColor(0x1ED760)
            .setThumbnail(trackIMG)
            .addField('Song Name', trackName, true)
            .addField('Album', trackAlbum, true)
            .addField('Author', trackAuthor, false)
            .addField('Listen to track:', `[\`${trackURL}\`](trackURL)`, false)

            message.channel.send(embed)

    } else {
        message.channel.send('> Este usuário não está ouvindo Spotify')
    }
}
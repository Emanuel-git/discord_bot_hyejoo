const Distube = require('distube')
const ee = require('../botConfig/embed.json')
const config = require('../botConfig/config.json')
const { MessageEmbed } = require('discord.js')
const { format } = require('../handlers/functions')
module.exports = client => {

    client.distube = new Distube(client, {
        searchSongs: false,
        emitNewSongOnly: false,
        highWaterMark: 1024*1024*64,
        leaveOnEmpty: true,
        leaveOnFinish: true,
        leaveOnStop: true,
        youtubeDL: true,
        updateYouTubeDL: true
    })

    // Queue status template
    const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'off'}\` | Loop: \`${queue.repeatMode || 'off'}\``

    // Distube event listeners
    client.distube

        .on('initQueue', queue => {
            queue.autoplay = false,
            queue.volume = 100
        })

        .on('playSong', (message, queue, song) => {
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setThumbnail(song.thumbnail)
                .setTitle('Playing :notes: ' + song.name)
                .setURL(song.url)
                .addField('Duration', `\`${song.formattedDuration}\``)
                .addField('Queue Status', status(queue))
                .setFooter(ee.footertext, ee.footericon)
                .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
            )
        })

        .on('addSong', (message, queue, song) => {
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setThumbnail(song.thumbnail)
                .setTitle('Added :thumbsup: ' + song.name)
                .setURL(song.url)
                .addField('Duration', `\`${song.formattedDuration}\``)
                .addField(`${queue.songs.length} Songs in the Queue`, `Duration: ${format(queue.duration * 1000)}`)
                .setFooter(`Requested by: ${song.user.tag}`, song.user.displayAvatarURL({ dynamic: true }))
        )
        })

        .on('playList', (message, queue, playlist, song) => {
            message.channel.send(
                `Play \`${playlist.name}\` playlist (${playlist.songs.length} songs).\nRequested by: ${song.user}\nNow Playing \`${song.name}\` - \`${song.formattedDuration}\``
            )
        })

        .on('addList', (message, queue, playlist) => {
            message.channel.send(
                `Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to the queue\n${status(queue)}`
            )
        })

        .on('searchResult', (message, result) => {
            let i = 0
            message.channel.send(
                `**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join('\n')}`
            )
        })

        .on('searchCancel', message => {
            message.channel.send('Searching canceled!')
        })

        .on('error', (message, e) => {
            console.log(e)
            message.channel.send('An error encountered: ' + e)
        })
}
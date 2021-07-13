const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const ytpl = require('ytpl')
const { servers } = require('..')
const ytdlOptions = require('../JSONfiles/config.json').YTDL
const googleKey = require('../JSONfiles/config.json').GOOGLE_KEY
const google = require('googleapis')

const youtube = new google.youtube_v3.Youtube({
    version: 'v3',
    auth: googleKey
})

const formatVideoName = name => name
                                    .replace(/&quot;/g, '"')
                                    .replace(/&#39;/g, "'")
                                    .replace(/&amp;/g, '&')
                                    
const play = (message) => {
    if (servers[message.guild.id].isPlaying === false) {
        const link = servers[message.guild.id].queue[0].link
        servers[message.guild.id].isPlaying = true

        // const playingMessage

        console.log('link: ' + link)
        console.log('name: ' + servers[message.guild.id].queue[0].name)
        console.log('channel: ' + servers[message.guild.id].queue[0].channel)

        servers[message.guild.id].dispatcher = servers[message.guild.id].connection.play(ytdl(link, ytdlOptions))

        const embed = new Discord.MessageEmbed()
            .setDescription('Now playing ' + servers[message.guild.id].queue[0].name)

        message.channel.send(embed).then(m => playingMessage = m)

        servers[message.guild.id].dispatcher.on('finish', () => {
            playingMessage.delete()
            
            servers[message.guild.id].queue.shift()
            servers[message.guild.id].isPlaying = false
            
            if (servers[message.guild.id].queue.length > 0) {
                play(message)
            }
            else {
                servers[message.guild.id].dispatcher = null
            }
        })
    }
}

module.exports.run = async (client, message, args) => {
    let song = args.join(' ')

    if (!message.member.voice.channel) {
        message.channel.send('```Você precisa estar conectado a um canal de voz!```')
        return
    }

    if (servers[message.guild.id].connection === null) {
        servers[message.guild.id].connection = await message.member.voice.channel.join()
            // .then(connection => connection.voice.setSelfDeaf(true))
    }
    servers[message.guild.id].connection.voice.setSelfDeaf(true)

    if (song.trim().length === 0) {
        message.channel.send('```- Eu preciso de algo pra tocar!```')
        return
    }

    if (ytpl.validateID(song)) {
        ytpl.getPlaylistID(song)
            .then(playlist => ytpl(playlist, { pages: 1 }))
            .then(p => {
                let count = 0
                p.items.forEach(i => {
                    count++
                    servers[message.guild.id].queue.push(
                        {
                            link: i.shortUrl,
                            name: formatVideoName(i.title), 
                            channel: i.author.name
                        }
                        )
                })
                message.channel.send(count + ' músicas foram adicionadas a fila')
                play(message)
            })
    }
    else if (ytdl.validateURL(song)) {
        // servers[message.guild.id].queue.push(song)
        // play(message)
        youtube.search.list({
            q: song,
            part: 'snippet',
            fields: 'items(id(videoId), snippet(title, channelTitle))',
            type: 'video',
            maxResults: 1
        }, (err, result) => {
            if (err) console.log(err)
            else {
                servers[message.guild.id].queue.push(
                    {
                        link: 'https://www.youtube.com/watch?v=' + result.data.items[0].id.videoId,
                        name: formatVideoName(result.data.items[0].snippet.title), 
                        channel: result.data.items[0].snippet.channelTitle
                    }
                    )
                
                play(message)
            }
        })
    }
    else {
        youtube.search.list({
            q: song,
            part: 'snippet',
            fields: 'items(id(videoId), snippet(title, channelTitle))',
            type: 'video',
        }, (err, result) => {
            if (err) console.log(err)
            else {
                const resultList = []

                result.data.items.forEach(item => {
                    const createItem = {
                        'videoTitle': formatVideoName(item.snippet.title),
                        'channelName': item.snippet.channelTitle,
                        'id': 'https://www.youtube.com/watch?v=' + item.id.videoId
                    }

                    resultList.push(createItem)
                })

                const embed = new Discord.MessageEmbed()
                    .setAuthor('Hyejoo')
                    .setDescription('Escolha sua música de 1-5!')

                for (let i in resultList) {
                    embed.addField(
                        `${parseInt(i) + 1}: ${resultList[i].videoTitle}`,
                        resultList[i].channelName
                    )
                }

                message.lineReplyNoMention(embed)
                    .then(embedMessage => {
                        const reactions  = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

                        reactions.forEach(reaction => embedMessage.react(reaction))

                        const filter = (reaction, user) => {
                            return reactions.includes(reaction.emoji.name)
                                && user.id === message.author.id
                        }

                        embedMessage.awaitReactions(filter, { max: 1, time: 20000, erros: ['time']})
                            .then(collected => {
                                const reaction = collected.first()
                                const idChosenOption = reactions.indexOf(reaction.emoji.name)

                                message.channel.send(
                                    '```Você escolheu '
                                    + resultList[idChosenOption].videoTitle + ' de '
                                    + resultList[idChosenOption].channelName + '```'
                                )

                                servers[message.guild.id].queue.push(
                                {
                                    link: resultList[idChosenOption].id,
                                    name: formatVideoName(resultList[idChosenOption].videoTitle), 
                                    channel: resultList[idChosenOption].channelName
                                }
                                )

                                play(message)
                            }).catch(error => {
                                message.reply('Você não escolheu uma opção válida!')
                            })
                    })
            }
        })
    }
}
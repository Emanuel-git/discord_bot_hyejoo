const Discord = require('discord.js')
const ytdl = require('ytdl-core')
const { servers } = require('..')
const ytdlOptions = require('../JSONfiles/config.json').YTDL
const googleKey = require('../JSONfiles/config.json').GOOGLE_KEY
const google = require('googleapis')

const youtube = new google.youtube_v3.Youtube({
    version: 'v3',
    auth: googleKey
})

const play = message => {
    if (servers[message.guild.id].isPlaying === false) {
        const currentSong = servers[message.guild.id].queue[0]
        servers[message.guild.id].isPlaying = true

        console.log('currentSong: ' + currentSong)
        console.log('servers[message.guild.id].queue: '+ servers[message.guild.id].queue)

        servers[message.guild.id].dispatcher = servers[message.guild.id].connection.play(ytdl(currentSong, ytdlOptions))

        servers[message.guild.id].dispatcher.on('finish', () => {
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
    }
    

    if (song.trim().length === 0) {
        message.channel.send('```- Eu preciso de algo pra tocar!```')
        return
    }

    if (ytdl.validateURL(song)) {
        console.log('Pelo link: ' + song)
        servers[message.guild.id].queue.push(song)
        play(message)
    }
    else {
        youtube.search.list({
            q: song,
            part: 'snippet',
            fields: 'items(id(videoId), snippet(title, channelTitle))',
            type: 'video'
        }, (err, result) => {
            if (err) console.log(err)
            else {
                // const id = resultado.data.items[0].id.videoId
                // song = 'https://www.youtube.com/watch?v=' + id
                // console.log('Pela pesquisa: ' + song)
                // servers[message.guild.id].queue.push(song)
                // play()

                const resultList = []

                for (let i in result.data.items) {
                    const createItem = {
                        'videoTitle': result.data.items[i].snippet.title,
                        'channelName': result.data.items[i].snippet.channelTitle,
                        'id': 'https://www.youtube.com/watch?v=' + result.data.items[i].id.videoId
                    }

                    resultList.push(createItem)
                }

                const embed = new Discord.MessageEmbed()
                    .setColor('#0000ff')
                    .setAuthor('Hyejoo')
                    .setDescription('Escolha sua música de 1-5!')

                for (let i in resultList) {
                    embed.addField(
                        `${parseInt(i) + 1}: ${resultList[i].videoTitle}`,
                        resultList[i].channelName
                    )
                }

                message.channel.send(embed)
                    .then(embedMessage => {
                        const reactions  = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

                        for (let i = 0; i < reactions.length; i++) {
                            embedMessage.react(reactions[i])
                        }

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

                                servers[message.guild.id].queue.push(resultList[idChosenOption].id)
                                play(message)
                            }).catch(error => {
                                message.reply('Você não escolheu uma opção válida!')
                            })
                    })
            }
        })
    }
}
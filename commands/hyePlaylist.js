/*
   Basically, this command just add new songs to Hyejoo playlist
   that i intend to be ramdomly put on her status an intervals of 
   3 minutes +-
*/ 

const Discord = require('discord.js')
const fs = require('fs')

module.exports.run = async (client, message, args) => {
    let song = args.join(' ')

    song = JSON.parse(`{ "name": "${song}" }`)

    message.delete().catch(m => {})

    fs.readFile('./commands/hyePlaylist.json', function(err, content) {
        if (err) throw err

        let parseJson = JSON.parse(content)
        parseJson.songs.push(song)

        fs.writeFile('./commands/hyePlaylist.json', JSON.stringify(parseJson), function(err) {
            if (err) throw err
        })

        message.channel.send(`> ${args.join(' ')} adicionada com sucesso na minha playlist!`)

    })
}
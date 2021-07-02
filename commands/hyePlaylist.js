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

    fs.readFile('hyePlaylist.json', function(err, content) {
        if (err) throw err

        let parseJson = JSON.parse(content)
        parseJson.songs.push(song)

        fs.writeFile('hyePlaylist.json', JSON.stringify(parseJson), function(err) {
            if (err) throw err
        })
    })
}
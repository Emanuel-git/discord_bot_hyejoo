const { MessageEmbed } = require('discord.js')
const config = require('../../botConfig/config.json')
const ee = require('../../botConfig/embed.json')
const { getTracks, getPreview } = require('spotify-url-info')
module.exports = {
    name: 'play',
    category: 'Music',
    aliases: ['p'],
    cooldown: 4,
    usage: 'play <URL / TITLE>',
    description: 'Plays a track!',
    run: async (client, message, args, argsPlus, cmduser, text, prefix) => {
        try {

            const { channel } = message.member.voice

            if (!channel) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Please join a voice channel first!`)
                )
            }

            if (client.distube.isPlaying(message) && channel.id !== message.guild.me.voice.channel.id) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Please join **my** channel first!`)
                    .setDescription(`Channel name: \`${message.guild.me.voice.channel.name}\``)
                )
            }

            if (!args[0]) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`You didn't provided a text!`)
                    .setDescription(`Usage: \`${prefix}play <Your Text>\``)
                )
            }
            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle('Searching Song')
                .setDescription(`\`\`\`fix\n${text}\`\`\``) 
            ).then(message => message.delete({ timeout: 3000 }).catch(e => console.log(e)))

            if (text.toLowerCase().includes('spotify') && text.toLowerCase().includes('track')) {
                getPreview(text).then(result => {
                    client.distube.play(message, result.title)
                })
            }

            else if (text.toLowerCase().includes('spotify') && text.toLowerCase().includes('playlist')) {
                getTracks(text).then(result => {
                    result.forEach(song => {
                        client.distube.play(message, result.title)
                    })        
                })
            }

            else {
                client.distube.play(message, text)
            }

        }
        catch (e) {
            console.log(e.stack)
            return message.channel.send(new MessageEmbed()
                .setColor(ee.wrongcolor)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`An error occurred`)
                .setDescription(`\`\`\`${e.stack}\`\`\``)
            )
        }
    }
}
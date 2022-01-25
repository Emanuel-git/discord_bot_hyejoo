const { MessageEmbed } = require('discord.js')
const config = require('../../botConfig/config.json')
const ee = require('../../botConfig/embed.json')
module.exports = {
    name: 'queue',
    category: 'Music',
    aliases: ['q', 'fila'],
    cooldown: 4,
    usage: 'queue',
    description: 'Shows the current queue!',
    run: async (client, message, args, cmduser, text, prefix) => {
        try {

            const { channel } = message.member.voice

            if (!channel) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Please join a voice channel first!`)
                )
            }

            if (!client.distube.getQueue(message)) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`I am not playing something`)
                    .setDescription('The Queue is empty')
            )
            }

            if (client.distube.getQueue(message) && channel.id !== message.guild.me.voice.channel.id) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Please join **my** channel first!`)
                    .setDescription(`Channel name: \`${message.guild.me.voice.channel.name}\``)
                )
            }

            let queue = client.distube.getQueue(message)

            let embed = new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle(`Queue for: ${message.guild.name}`)

            let counter = 0
            
            for (let i = 0; i < queue.songs.length; i += 20) {
                let k = queue.songs
                let songs = k.slice(i, i + 20)

                if (counter === 5) break

                message.channel.send(embed.setDescription(songs.map(
                    (song, index) => `**${index + 1 + counter * 20}.** [${song.name}](${song.url}) - ${song.formattedDuration}`)))
                
                counter++
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
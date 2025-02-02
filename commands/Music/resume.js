const { MessageEmbed } = require('discord.js')
const config = require('../../botConfig/config.json')
const ee = require('../../botConfig/embed.json')
module.exports = {
    name: 'resume',
    category: 'Music',
    aliases: [],
    cooldown: 4,
    usage: 'resume',
    description: 'Resume the Queue.',
    run: async (client, message, args, cmduser, text, prefix) => {
        try {

            const { channel } = message.member.voice

            if (!channel) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Please join a voice channel firs!`)
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

            if (client.distube.isPlaying(message)) {
                return message.channel.send(new MessageEmbed()
                    .setColor(ee.wrongcolor)
                    .setFooter(ee.footertext, ee.footericon)
                    .setTitle(`Cannot resume the song!`)
                    .setDescription(`It's not paused`)
            )
            }

            message.channel.send(new MessageEmbed()
                .setColor(ee.color)
                .setFooter(ee.footertext, ee.footericon)
                .setTitle('⏸ Resumed the track')
            ).then(message => message.delete({ timeout: 4000 }).catch(e => console.log(e)))

            client.distube.resume(message)
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
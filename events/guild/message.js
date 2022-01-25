const config = require('../../botConfig/config.json')
const ee = require('../../botConfig/embed.json')
const settings = require('../../botConfig/settings.json')
const Discord = require('discord.js')
const { onCoolDown, replacemsg } = require('../../handlers/functions')

module.exports = async (client, message) => {
    try {
        if (!message.guild) return
        if (message.author.bot) return

        if (message.channel.partial) await message.channel.fetch()
        if (message.partial) await message.fetch()

        const prefix = config.PREFIX
        if (!message.content.toLowerCase().startsWith(prefix)) return

        const args = message.content
                        .slice(prefix.length)
                        .trim()
                        .split(/ +/)
                        .filter(Boolean)
        
        const cmd = args.length > 0 ? args.shift().toLowerCase() : ''
        if (cmd.length === 0) {
            return message.channel.send('You have to send a command!')
        }

        let command = client.commands.get(cmd)
        if (!command) command = client.commands.get(client.aliases.get(cmd))

        if (command) {
            if (onCoolDown(message, command)) {
                return message.channel.send({
                    embed: new Discord.MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(replacemsg(settings.messages.cooldown, {
                            prefix: prefix,
                            command: command,
                            timeLeft: onCoolDown(message, command)
                        }))
                })
            }

            try {
                if (settings.delete_commands) {
                    try {
                        message.delete()
                    }
                    catch {}
                }

                if (command.memberpermissions && command.memberpermissions.length > 0 && !message.member.hasPermission(command.memberpermissions)) {
                    return message.channel.send(
                        {
                            embed: new Discord.MessageEmbed()
                                        .setColor(ee.wrongcolor)
                                        .setFooter(ee.footertext, ee.footericon)
                                        .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
                                        .setDescription(
                                            replacemsg(settings.messages.notallowed_to_exec_cmd.description.memberpermissions,
                                            {
                                                command: command,
                                                prefix: prefix
                                            })
                                        )
                        }
                    ).then(msg => msg.delete({ timeout: settings.timeout.notallowed_to_exec_cmd.memberpermissions }).catch(e => {}))
                }

                if (command.alloweduserids && command.alloweduserids.length > 0 && !command.alloweduserids.includes(message.author.id)) {
                    return message.channel.send(
                    {
                        embed: new Discord.MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(replacemsg(settings.messages.notallowed_to_exec_cmd.title))
                                    .setDescription(
                                        replacemsg(settings.messages.notallowed_to_exec_cmd.description.alloweduserids,
                                        {
                                            command: command,
                                            prefix: prefix
                                        })
                                    )
                    }
                    ).then(msg => msg.delete({ timeout: settings.timeout.notallowed_to_exec_cmd.alloweduserids }).catch((e) => {}));
                }

                if (command.minargs && command.minargs > 0 && args.length < command.minargs) {
                    return message.channel.send(
                    {
                        embed: new Discord.MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(":x: Wrong Command Usage!")
                                    .setDescription(
                                        command.argsmissing_message && command.argsmissing_message.trim().length > 0 ? command.argsmissing_message : command.usage ? "Usage: " + command.usage : "Wrong Command Usage")
                    }
                    ).then(msg => msg.delete({ timeout: settings.timeout.minargs}).catch((e) => {}));
                }

                if (command.maxargs && command.maxargs > 0 && args.length > command.maxargs) {
                    return message.channel.send(
                    {
                        embed: new Discord.MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(":x: Wrong Command Usage!")
                                    .setDescription(
                                        command.argstoomany_message && command.argstoomany_message.trim().length > 0 ? command.argstoomany_message : command.usage ? "Usage: " + command.usage : "Wrong Command Usage")
                    }
                    ).then(msg => msg.delete({ timeout: settings.timeout.maxargs }).catch((e) => {}));
                }

                if (command.minplusargs && command.minplusargs > 0 && args.join(" ").split("++").filter(Boolean).length < command.minplusargs) {
                    return message.channel.send(
                    {
                        embed: new Discord.MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(":x: Wrong Command Usage!")
                                    .setDescription(
                                        command.argsmissing_message && command.argsmissing_message.trim().length > 0 ? command.argsmissing_message : command.usage ? "Usage: " + command.usage : "Wrong Command Usage")
                    }
                    ).then(msg => msg.delete({ timeout: settings.timeout.minplusargs }).catch((e) => {}));
                }
                  
                if (command.maxplusargs && command.maxplusargs > 0 && args.join(" ").split("++").filter(Boolean).length > command.maxplusargs) {
                    return message.channel.send(
                    {
                        embed: new Discord.MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(":x: Wrong Command Usage!")
                                    .setDescription(
                                        command.argstoomany_message && command.argstoomany_message.trim().length > 0 ? command.argsmissing_message : command.usage ? "Usage: " + command.usage : "Wrong Command Usage")
                    }
                    ).then(msg => msg.delete({ timeout: settings.timeout.maxplusargs }).catch((e) => {}));
                }

                command.run(client, message, args, args.join(' ').split('++').filter(Boolean), message.member, args.join(' '), prefix)
            }
            catch (error) {
                if (settings.somethingwentwrong_cmd) {
                    return message.channel.send(
                    {
                        embed: new Discord.MessageEmbed()
                                    .setColor(ee.wrongcolor)
                                    .setFooter(ee.footertext, ee.footericon)
                                    .setTitle(
                                        replacemsg(settings.messages.somethingwentwrong_cmd.title,
                                        {
                                            prefix: prefix,
                                            command: command
                                        }
                                        )
                                    )
                                    .setDescription(
                                        replacemsg(settings.messages.somethingwentwrong_cmd.description,
                                        {
                                            error: error,
                                            prefix: prefix,
                                            command: command
                                        }
                                        )
                                    )
                  }).then(msg => msg.delete({ timeout: 5000 }).catch((e) => {}));
                }
              }
        }
        else {
            return message.channel.send(
            {
                embed: new Discord.MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setFooter(ee.footertext, ee.footericon)
                        .setTitle(
                            replacemsg(settings.messages.unknown_cmd,
                            {
                                prefix: prefix
                            }
                            )
                        )
              }).then(msg => msg.delete({ timeout: 5000 }).catch(e => {}));
        }
    } 
    catch (error) {
        console.log(error)
        return message.channel.send(
        {
            embed: new Discord.MessageEmbed()
                        .setColor(ee.wrongcolor)
                        .setTitle(replacemsg(settings.messages.error_occur))
                        .setDescription(
                            replacemsg(settings.messages.error_occur_desc,
                            {
                                error: error
                            }
                            )
                        )
        });
    }
}
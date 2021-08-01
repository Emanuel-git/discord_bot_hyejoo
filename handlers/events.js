const fs = require('fs')
const allevents = []
module.exports = async client => {
    try {
        const load_dir = dir => {
            const event_files = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'))
            for (const file of event_files) {
                const event = require(`../events/${dir}/${file}`)
                let eventName = file.split('.')[0]
                allevents.push(eventName)
                client.on(eventName, event.bind(null, client))
            }
        }
        await ['client', 'guild'].forEach(e => load_dir(e))
    }
    catch (e) {
        console.log(e)
    }
    
}
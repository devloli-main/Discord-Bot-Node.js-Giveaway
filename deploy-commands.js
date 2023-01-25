const { REST, Routes } = require('discord.js');
const fs = require('fs');
const {token, clientId, guildId} =  require('./config.js');

exports.DeployCommands = async () => { 
    const commands = [];

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: '10' }).setToken(token);
    console.log('[DEPLOY] Deploying commands...'.yellow);
    (async () => {
        try {
            console.log('[DEPLOY] Started refreshing application (/) commands.'.blue);
            await rest.put(
                Routes.applicationGuildCommands(clientId, guildId),
                { body: commands },
            );
            console.log('[DEPLOY] Successfully reloaded application (/) commands.'.green);
        } catch (error) {
            console.error(`[DEPLOY] Error while refreshing application (/) commands: ${error}`.red);
        }
    })();
    
    const maxLength = commands.reduce((max, command) => Math.max(max, command.name.length), 0);
    for (const command of commands) {
        console.log(`[DEPLOY] ${`${command.name.padEnd(maxLength)} | ${command.description} (${command.options ? command.options.length : 0} options)`.gray}`.green);
    }
}
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('🏓 Reply with the bot\'s latency! /ping'),

    async execute(interaction, client) {
        await interaction.reply({ embeds: [client.config.embeds.N('🏓', `Pong! \`${client.ws.ping}ms\``)], ephemeral: true });
    }
};
const { WebhookClient } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    once: false,

    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, client);
        } catch (error) {
            const errorWebhook = new WebhookClient({ id: client.config.webhooks.error.id, token: client.config.webhooks.error.token });
            const webhookEmbed = {
                author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL()
                },
                description: `
\`⛔\` : Command : \`${interaction.commandName}\`
\`📝\` : Error Stack
\`\`\`js
${error.stack}
\`\`\`
                `,
                color: client.config.colors.error,
                timestamp: new Date()
            };
            errorWebhook.send({ embeds: [webhookEmbed] });
        }
    }
};
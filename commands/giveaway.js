const { SlashCommandBuilder, ChannelType, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('giveaway')
        .setDescription('🎁 Create a giveaway! /giveaway <channel> <host> <duration> <winners> <prize>')
        .addChannelOption(option => option.setName('channel').setDescription('The channel of the giveaway.').setRequired(true))
        .addUserOption(option => option.setName('host').setDescription('The host of the giveaway.').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('The duration of the giveaway. (10 minutes, 30 minutes or 1 hour)').setRequired(true)
            .addChoices(
                { name: '10 seconds', value: '10s' },
                { name: '10 minutes', value: '10m' },
                { name: '30 minutes', value: '30m' },
                { name: '1 hour', value: '1h' }
            ))
        .addIntegerOption(option => option.setName('winners').setDescription('The amount of winners (1-10).').setRequired(true))
        .addStringOption(option => option.setName('prize').setDescription('The prize of the giveaway.').setRequired(true))
        .setDMPermission(false)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');
        const host = interaction.options.getUser('host');
        let duration = interaction.options.getString('duration');
        const winners = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');

        if (channel.type !== ChannelType.GuildText) {
            return await interaction.reply({ embeds: [client.config.embeds.E('The channel must be a text channel.')], ephemeral: true });
        }

        if (duration !== '10s' && duration !== '10m' && duration !== '30m' && duration !== '1h') {
            return await interaction.reply({ embeds: [client.config.embeds.E('The duration must be 10 minutes, 30 minutes or 1 hour.')], ephemeral: true });
        }

        if (winners < 1 || winners > 10) {
            return await interaction.reply({ embeds: [client.config.embeds.E('The amount of winners must be between 1 and 10.')], ephemeral: true });
        }

        const end = Date.now() + (duration === '10s' ? 10000 : duration === '10m' ? 600000 : duration === '30m' ? 1800000 : 3600000)

        const embed = new EmbedBuilder()
            .setTitle(prize)
            .setDescription(`Hosted by: ${host}\nEnds at: <t:${Math.floor(end / 1000)}:R>\nEntries: 0\nWinners: ${winners}`)
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('giveaway')
                    .setLabel('🎉 Enter') // if user has already entered, change label to '🎉 Cancel'
                    .setStyle(ButtonStyle.Secondary)
            );

        const msg = await channel.send({ embeds: [embed], components: [row] });

        await interaction.reply({ embeds: [client.config.embeds.S(`Giveaway created in ${channel}!`)], ephemeral: true });

        const filter = (button) => button.customId === 'giveaway' && button.user.id !== client.user.id;

        const collector = msg.createMessageComponentCollector({ filter, time: duration === '10s' ? 10000 : duration === '10m' ? 600000 : duration === '30m' ? 1800000 : 3600000 });

        const entries = [];

        collector.on('collect', async (button) => {
            if (button.user.id === client.user.id) 
            if (entries.includes(button.user.id)) {
                entries.splice(entries.indexOf(button.user.id), 1);
                embed.setDescription(`Hosted by: ${host}\nEnds at: <t:${Math.floor(end / 1000)}:R>\nEntries: ${entries.length}\nWinners: ${winners}`);
                await msg.edit({ embeds: [embed] });
                return await button.reply({ content: 'You have cancelled your entry.', ephemeral: true });
            }

            entries.push(button.user.id);
            embed.setDescription(`Hosted by: ${host}\nEnds at: <t:${Math.floor(end / 1000)}:R>\nEntries: ${entries.length}\nWinners: ${winners}`);
            await msg.edit({ embeds: [embed] });
            await button.reply({ content: 'You have entered the giveaway!', ephemeral: true });
        });

        collector.on('end', async () => {
            let announce;
            if (entries.length === 0) {
                announce = `No one entered the giveaway!`;
                embed.setDescription(`Hosted by: ${host}\nEnds at: <t:${Math.floor(end / 1000)}:R>\nEntries: 0\nWinners: ${winners}\n\nNo one entered the giveaway!`);
                await msg.edit({ embeds: [embed], components: [] });
                return;
            }

            const winner = [];

            for (let i = 0; i < winners; i++) {
                const random = Math.floor(Math.random() * entries.length);
                winner.push(entries[random]);
                entries.splice(random, 1);
            }

            embed.setDescription(`Hosted by: ${host}\nEnds at: <t:${Math.floor(end / 1000)}:R>\nEntries: ${entries.length}\nWinners: ${winner.map((id) => `<@${id}>`).join(', ')}`);
            await msg.edit({ embeds: [embed], components: [] });

            announce = `Congratulations ${winner.map((id) => `<@${id}>`).join(', ')}! You won **${prize}**!`;

            // announce winners
            await channel.send({ content: announce });
        });
    }
}

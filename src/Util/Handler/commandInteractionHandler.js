import { EmbedBuilder } from "discord.js";
import { cooldownControl } from "../Functions/cooldown.js";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 */

export default async interaction => {

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    // Permission Check
    if (interaction.guild) {
        const { me } = interaction.guild.members;
        if (command.required_bot_permissions && command.required_bot_permissions.some(perm => !me.permissionsIn(interaction.channel).has(perm))) {
            const permissions = command.required_bot_permissions.filter(perm => !me.permissionsIn(interaction.channel).has(perm)).map(perm => perm).join(", ");
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`İşleme devam edebilmek için bana \`${permissions}\` izinlerini vermelisin.`)
                        .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                ],
                ephemeral: true
            });
        };

        if (command.required_user_permissions && command.required_user_permissions.some(perm => !interaction.member.permissions.has(perm))) {
            const permissions = command.required_user_permissions.filter(perm => !interaction.member.permissions.has(perm)).map(perm => perm).join(", ");
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Blurple")
                        .setDescription(`İşleme devam edebilmek için \`${permissions}\` izinlerine sahip olmalısınız.`)
                        .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                ],
                ephemeral: true
            });
        }
    };

    // Cooldown Check
    const cooldown = cooldownControl(command, interaction.user.id);
    if (cooldown) return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`İşleme devam edebilmek \`${cooldown}\` saniye bekleyin.`)
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
        ], ephemeral: true
    })

    try {
        await command.execute(interaction);
    } catch (error) {
        interaction.client.emit("errorHandler", error, interaction);
    };

};
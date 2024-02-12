import { EmbedBuilder } from "discord.js";
import { cooldownControl } from "../Functions/cooldown.js";

/**
 * @param {import("discord.js").ButtonInteraction} interaction
 */

export default async interaction => {

    const button = interaction.client.buttons.get(interaction.customId);
    if (!button) return;

    // Permission Check
    if (interaction.guild) {
        const { me } = interaction.guild.members;
        if (button.required_bot_permissions && button.required_bot_permissions.some(perm => !me.permissionsIn(interaction.channel).has(perm))) {
            const permissions = button.required_bot_permissions.filter(perm => !me.permissionsIn(interaction.channel).has(perm)).map(perm => perm).join(", ");
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

        if (button.required_user_permissions && button.required_user_permissions.some(perm => !interaction.member.permissions.has(perm))) {
            const permissions = button.required_user_permissions.filter(perm => !interaction.member.permissions.has(perm)).map(perm => perm).join(", ");
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
    const cooldown = cooldownControl(button, interaction.user.id, "button");
    if (cooldown) return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`İşleme devam edebilmek \`${cooldown}\` saniye bekleyin.`)
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
        ], ephemeral: true
    })

    try {
        await button.execute(interaction);
    } catch (error) {
        interaction.client.emit("errorHandler", error, interaction);
    };

};
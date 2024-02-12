import { EmbedBuilder } from "discord.js";
import { cooldownControl } from "../Functions/cooldown.js";

/**
 * @param {import("discord.js").modalInteraction} interaction
 */

export default async interaction => {

    const modal = interaction.client.modals.get(interaction.customId);
    if (!modal) return;

    // Permission Check
    if (interaction.guild) {
        const { me } = interaction.guild.members;
        if (modal.required_bot_permissions && modal.required_bot_permissions.some(perm => !me.permissionsIn(interaction.channel).has(perm))) {
            const permissions = modal.required_bot_permissions.filter(perm => !me.permissionsIn(interaction.channel).has(perm)).map(perm => perm).join(", ");
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

        if (modal.required_user_permissions && modal.required_user_permissions.some(perm => !interaction.member.permissions.has(perm))) {
            const permissions = modal.required_user_permissions.filter(perm => !interaction.member.permissions.has(perm)).map(perm => perm).join(", ");
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
    const cooldown = cooldownControl(modal, interaction.user.id, "modal");
    if (cooldown) return interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`İşleme devam edebilmek \`${cooldown}\` saniye bekleyin.`)
                .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
        ], ephemeral: true
    })

    try {
        await modal.execute(interaction);
    } catch (error) {
        interaction.client.emit("errorHandler", error, interaction);
    };

};
import { EmbedBuilder } from "discord.js";

export const data = {
    category: "Moderasyon",
    name: "kick",
    description: "Belirtilen kullanıcıyı sunucudan atar.",
    required_bot_permissions: ["KickMembers"],
    required_user_permissions: ["KickMembers"],
    options: [
        {
            name: "kullanıcı",
            description: "Kullanıcı belirtin.",
            type: 6,
            required: true
        },
    ],

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        const member = interaction.options.getMember("kullanıcı");

        if (member && member.id === interaction.user.id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`${emoji("ignore")} Hata!`)
                    .setDescription(`${reply.own}`)
                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            ephemeral: true
        });

        if (member && member.id === interaction.client.user.id) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`${emoji("ignore")} Hata!`)
                    .setDescription(`${reply.client}`)
                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            ephemeral: true
        });

        if (member && interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Blurple")
                    .setTitle(`${emoji("ignore")} Hata!`)
                    .setDescription(`${reply.auth}`)
                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                    .setTimestamp()
            ],
            ephemeral: true
        });

        member.kick(member)
            .then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("mark")} Başarılı!`)
                            .setDescription(`**${member.user.username}** kullanıcı sunucudan atıldı.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                })
            })
            .catch(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("ignore")} Hata!`)
                            .setDescription(`kullanıcı sunucudan atılırken bir sorun oluştu.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                })
            })

    }
}
import config from "../../Config/config.js";
import { t } from "i18next";
import guildSchema from "../../Util/Database/guild_schema.js";
import { EmbedBuilder, ChannelType } from "discord.js";

export const data = {
    category: "Moderasyon",
    name: "otorol",
    description: "Bir kullanıcı sunucuya katıldığında belirtilen rolü verir.",
    required_bot_permissions: ["ManageRoles", "ManageChannels"],
    required_user_permissions: ["ManageRoles", "ManageChannels"],
    options: [
        {
            name: "ayarla",
            description: "Otorol sistemini ayarlayın.",
            type: 1,
            options: [
                {
                    name: "kanal",
                    description: "Bir kanal belirtin.",
                    type: 7,
                    channel_types: [ChannelType.GuildText],
                    required: true
                },
                {
                    name: "rol",
                    description: "Bir rol belirtin.",
                    type: 8,
                    required: true
                },
                {
                    name: "mesaj",
                    description: "Otorol mesajını belirtin.",
                    type: 3,
                },
            ]
        },
        {
            name: "ayarlar",
            description: "Otorol ayarlarını gösterir.",
            type: 1
        },
        {
            name: "sıfırla",
            description: "Otorol sistemini sıfırlar.",
            type: 1
        }
    ],

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        if (interaction.options.getSubcommand() === "ayarla") {

            const channel = interaction.options.getChannel("kanal");
            const role = interaction.options.getRole("rol");
            const message = interaction.options.getString("mesaj");

            guildSchema.updateOne({ guildID: interaction.guild.id }, {
                $set: {
                    autoRoleConfig: {
                        channel: channel.id,
                        role: role.id,
                        message: message ? message : config.autoRole.DEFAULT_MESSAGE
                    }
                },
            }, { upsert: true }).then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("mark")} Başarılı!`)
                            .setDescription(`Otorol başarıyla ayarlandı.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                });
            }).catch(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("ignore")} Hata!`)
                            .setDescription(`Otorol ayarlanırken bir sorun oluştu.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            });

        } else if (interaction.options.getSubcommand() === "ayarlar") {

            let autoRoleData = await guildSchema.findOne({ guildID: interaction.guild.id });
            let channel = autoRoleData?.autoRoleConfig?.channel ? autoRoleData?.autoRoleConfig?.channel : null;
            let role = autoRoleData?.autoRoleConfig?.role ? autoRoleData?.autoRoleConfig?.role : null;
            let message = autoRoleData?.autoRoleConfig?.message ? autoRoleData?.autoRoleConfig?.message : null;

            if (channel != null && role != null) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .addFields(
                                { name: "Kanal", value: channel == null ? "Bilinmiyor" : `<#${channel}>`, inline: true },
                                { name: "Rol", value: role == null ? "Bilinmiyor" : `<@&${role}>`, inline: true },
                                { name: "Mesaj", value: message, inline: true }
                            )
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                });
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setDescription(`${emoji("ignore")} Otorol ayarlaması bulunmamaktadır.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            };

        } else if (interaction.options.getSubcommand() === "sıfırla") {
            let autoRoleData = await guildSchema.findOne({ guildID: interaction.guild.id });
            let channel = autoRoleData?.autoRoleConfig?.channel ? autoRoleData?.autoRoleConfig?.channel : null;
            let role = autoRoleData?.autoRoleConfig?.role ? autoRoleData?.autoRoleConfig?.role : null;

            if (channel != null && role != null) {
                guildSchema.updateOne({ guildID: interaction.guild.id }, { $unset: { autoRoleConfig: 1 } })
                    .then(() => {
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Blurple")
                                    .setTitle(`${emoji("mark")} Başarılı!`)
                                    .setDescription(`${emoji("settings")} Otorol başarıyla sıfırlandı.`)
                                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp()
                            ],
                        });
                    }).catch(() => {
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Blurple")
                                    .setTitle(`${emoji("ignore")} Hata!`)
                                    .setDescription(`Otorol sıfırlanırken bir sorun oluştu.`)
                                    .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp()
                            ],
                            ephemeral: true
                        });
                    });
            } else {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("ignore")} Hata!`)
                            .setDescription(`Otorol ayarlaması bulunmamaktadır.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            };
        };

    }
}
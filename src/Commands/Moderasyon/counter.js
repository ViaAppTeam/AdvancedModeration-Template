import guildSchema from "../../Util/Database/guild_schema.js";
import { EmbedBuilder, ChannelType } from "discord.js";

export const data = {
    category: "Moderasyon",
    name: "sayaç",
    description: "Sunucunuza sayaç sistemini kurar..",
    required_bot_permissions: ["ManageChannels"],
    required_user_permissions: ["ManageChannels"],
    options: [
        {
            name: "ayarla",
            description: "Sayaç sistemini ayarlayın.",
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
                    name: "sayı",
                    description: "Kişi sayısını belirtin.",
                    type: 4,
                    required: true
                },
            ]
        },
        {
            name: "ayarlar",
            description: "Sayaç ayarlarını gösterir.",
            type: 1
        },
        {
            name: "sıfırla",
            description: "Sayaç sistemini sıfırlar.",
            type: 1
        }
    ],

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        if (interaction.options.getSubcommand() === "ayarla") {

            const channel = interaction.options.getChannel("kanal");
            const count = interaction.options.getInteger("sayı");

            guildSchema.updateOne({ guildID: interaction.guild.id }, {
                $set: {
                    counterConfig: {
                        channel: channel.id,
                        count: count,
                    }
                },
            }, { upsert: true }).then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                                    .setTitle(`${emoji("mark")} Başarılı!`)
                            .setDescription(`Sayaç sistemi başarıyla ayarlandı.`)
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
                            .setDescription(`Sayaç sistemi ayarlanırken bir sorun oluştu.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            });

        } else if (interaction.options.getSubcommand() === "ayarlar") {

            let counterData = await guildSchema.findOne({ guildID: interaction.guild.id });
            let channel = counterData?.counterConfig?.channel ? counterData?.counterConfig?.channel : null;
            let count = counterData?.counterConfig?.count ? counterData?.counterConfig?.count : null;

            if (channel != null && count != null) {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .addFields(
                                { name: "Kanal", value: channel == null ? "Bilinmiyor" : `<#${channel}>`, inline: true },
                                { name: "Sayı", value: count == null ? "Bilinmiyor" : `${count}`, inline: true },
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
                                    .setTitle(`${emoji("ignore")} Hata!`)
                            .setDescription(`Sayaç sistem ayarlaması bulunmamaktadır.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            };

        } else if (interaction.options.getSubcommand() === "sıfırla") {
            let counterData = await guildSchema.findOne({ guildID: interaction.guild.id });
            let channel = counterData?.counterConfig?.channel ? counterData?.counterConfig?.channel : null;
            let count = counterData?.counterConfig?.count ? counterData?.counterConfig?.count : null;

            if (channel != null && count != null) {
                guildSchema.updateOne({ guildID: interaction.guild.id }, { $unset: { counterConfig: 1 } })
                    .then(() => {
                        interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Blurple")
                                    .setTitle(`${emoji("mark")} Hata!`)
                                    .setDescription(`Sayaç sistemi başarıyla sıfırlandı.`)
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
                                    .setDescription(`Sayaç sistemi sıfırlanırken bir sorun oluştu.`)
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
                            .setDescription(`Sayaç sistem ayarlaması bulunmamaktadır.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                    ephemeral: true
                });
            };
        };

    }
}
import ms from "ms";
import { EmbedBuilder } from "discord.js";

export const data = {
    category: "Moderasyon",
    name: "timeout",
    description: "Belirtilen kullanıcıya zamanaşımı uygular.",
    required_bot_permissions: ["ModerateMembers"],
    required_user_permissions: ["MuteMembers"],
    options: [
        {
            name: "kullanıcı",
            description: "Kullanıcı belirtin.",
            type: 6,
            required: true
        },
        {
            name: "süre",
            description: "Bir süre belirtin. 1m, 1h, 1d",
            type: 3,
            required: true
        }
    ],

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        const member = interaction.options.getMember("kullanıcı");
        const time = interaction.options.getString("süre");

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

        member.timeout(ms(time))
            .then(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("mark")} Başarılı!`)
                            .setDescription(`**${member.user.username}** kullanıcıya zamanaşımı uygulandı.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                })
            })
            .catch((err) => {
                console.log(err)
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle(`${emoji("ignore")} Hata!`)
                            .setDescription(`kullanıcıya zamanaşımı uygulanırken bir sorun oluştu.`)
                            .setFooter({ text: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }) })
                            .setTimestamp()
                    ],
                })
            })

    }
}
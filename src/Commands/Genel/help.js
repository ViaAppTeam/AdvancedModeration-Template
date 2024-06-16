import { ActionRowBuilder, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";

export const data = {
    category: "Genel",
    name: "yardım",
    description: "Bot komutlarını listeler.",

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        const categories = [...new Set(interaction.client.commands.map((x) => x.category))];
        const selectMenuOptions = categories.map((category) => ({
            label: `${category}`,
            value: category
        }));

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId("category_select")
                    .setPlaceholder("Bir kategori seçin...")
                    .addOptions(selectMenuOptions)
            );

        const newEmbed = new EmbedBuilder()
            .setTitle(`ViaAppTeam Advanced Moderation - Yardım Menü`)
        .setColor(`Blurple`)
        .setImage("https://cdn.discordapp.com/attachments/1197563222824333363/1197863963954786394/20240119_142214_0000.png?ex=65bcd0c0&is=65aa5bc0&hm=237f86d4e630a086c5e8219646783c2d97efefad383fb035a3ba4c29d5544566&")
       .setThumbnail("https://cdn.discordapp.com/avatars/1026886238487191674/c886234a066185536694b45466ab74ca.webp?size=256https://cdn.discordapp.com/avatars/1026886238487191674/c886234a066185536694b45466ab74ca.webp?size=256")
        .setDescription(`
        Selam dostlar :wave: ! Ben **ViaAppTeam Advanced Moderation** benim sayemde sunucularınızı denetleyebilirsiniz.

        **Kategoriler:**
        > ${emoji("home")} Genel
        > ${emoji("moderator")} Moderasyon
        `)
        .setFooter({ text: `${interaction?.user?.username} tarafından istendi.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        .setTimestamp()
       
        interaction.reply({ embeds: [newEmbed], components: [row] })
            .then(msg => {

                const collector = msg.createMessageComponentCollector({ time: [120000] });
                collector.on("collect", interaction => {
                    if (interaction?.customId == "category_select") {
                        const categoryCommands = interaction.client.commands.filter(x => x.category === interaction?.values[0]);
                        let list = categoryCommands.map((x) => `**/${x.name}** → ${x.description}`).join("\n");
                        interaction?.update({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`${interaction.client.user.username} | ${interaction?.values[0]}`)
                                    .setColor("Blurple")
                                    .setColor(`Blurple`)
                                    .setImage("https://cdn.discordapp.com/attachments/1197563222824333363/1197863963954786394/20240119_142214_0000.png?ex=65bcd0c0&is=65aa5bc0&hm=237f86d4e630a086c5e8219646783c2d97efefad383fb035a3ba4c29d5544566&")
                                   .setThumbnail("https://cdn.discordapp.com/avatars/1026886238487191674/c886234a066185536694b45466ab74ca.webp?size=256https://cdn.discordapp.com/avatars/1026886238487191674/c886234a066185536694b45466ab74ca.webp?size=256")
                                   .setDescription(list)
                                    .setFooter({ text: `${interaction?.user?.username} tarafından istendi.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                                    .setTimestamp()
                            ]
                        });
                    };

                });

            });

    }
}

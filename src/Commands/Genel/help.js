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
        .setImage("https://cdn.discordapp.com/attachments/1074584753187074110/1207391263654158346/Remove-bg.ai_1707934890159.png?ex=666fd5fd&is=666e847d&hm=b848920744c8ad7921e68f25b4c8fcb64ff412eb7491ed717bb2f95fd7490538&")
       .setThumbnail("https://cdn.discordapp.com/attachments/1074584753187074110/1132992398465716344/ViaAppNew-removebg-preview.png?ex=667018e5&is=666ec765&hm=65e81fd250d1213a64587fbe04e324125b0316b44abf8260e6c50c0306e207e4&")
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
        .setImage("https://cdn.discordapp.com/attachments/1074584753187074110/1207391263654158346/Remove-bg.ai_1707934890159.png?ex=666fd5fd&is=666e847d&hm=b848920744c8ad7921e68f25b4c8fcb64ff412eb7491ed717bb2f95fd7490538&")
       .setThumbnail("https://cdn.discordapp.com/attachments/1074584753187074110/1132992398465716344/ViaAppNew-removebg-preview.png?ex=667018e5&is=666ec765&hm=65e81fd250d1213a64587fbe04e324125b0316b44abf8260e6c50c0306e207e4&")
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

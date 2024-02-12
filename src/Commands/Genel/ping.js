import { profileImage } from "discord-arts";
import { AttachmentBuilder } from "discord.js";

export const data = {
    category: "Genel",
    name: "ping",
    description: "Bot gecikmesini gönderir.",

    /**
     * @param {import("discord.js").ChatInputCommandInteraction} interaction
     */

    async execute(interaction) {

        interaction.reply({ content: `${emoji("settings")} Yükleniyor...` });

        const canvas = await profileImage(interaction.client.user.id, {
            customBackground: "https://media.discordapp.net/attachments/1138896988977512568/1138897058863001610/20230809_210704_0000.png?width=671&height=671",
            customTag: `${interaction.client.ws.ping} ms`,
            borderColor: "#242222",
            badgesFrame: true,
            presenceStatus: "online",
        });

        const attachment = new AttachmentBuilder(canvas, { name: `${interaction.user.id}.png` });
        interaction.editReply({ content: null, files: [attachment] });

    }
}
import { interactionResponse } from "../Util/Functions/interaction.js";

/**
 * @param {Object | String} error
 * @param {import("discord.js").BaseInteraction | import("discord.js").Message} interaction
 */

export default (error, interaction = null) => {

    if (interaction) {
        interactionResponse(interaction, { content: `${emoji("ignore")} İşleme devam edilemiyor. Lütfen geliştiricilere bildirin!`, ephemeral: true });
    };

    console.log(error);

};
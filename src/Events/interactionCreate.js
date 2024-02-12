import commandInteractionHandler from "../Util/Handler/commandInteractionHandler.js";
import buttonInteractionHandler from "../Util/Handler/buttonInteractionHandler.js"
import modalInteractionHandler from "../Util/Handler/modalInteractionHandler.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */

export default interaction => {

    if (interaction.isChatInputCommand()) return commandInteractionHandler(interaction);
    else if (interaction.isButton()) return buttonInteractionHandler(interaction);
    else if (interaction.isModalSubmit()) return modalInteractionHandler(interaction);

};
import config from "../../Config/config.js";
const cooldown = new Map()

export const cooldownControl = (command, userID, type = "command") => {

    const commandName = `${type}_${command.name}`;
    
    //if (process.env.BOT_OWNERS.includes(userID)) return;
    if (command.cooldown == false) return;
    if (!cooldown.has(commandName)) cooldown.set(commandName, new Map());

    const timestamp = cooldown.get(commandName);
    const cooldownAmount = (command.cooldown || config.DEFAULT_COOLDOWN) * 1000

    if (!timestamp.has(userID)) {
        timestamp.set(userID, Date.now());
        setTimeout(() => timestamp.delete(userID), cooldownAmount);
        return;
    };

    const expirationTime = timestamp.get(userID) + cooldownAmount;
    if (expirationTime >= Date.now()) {
        const timeLeft = ((expirationTime - Date.now()) / 1000).toFixed(1);
        return timeLeft == parseInt(timeLeft) ? parseInt(timeLeft) : timeLeft;
    } else return false;

};
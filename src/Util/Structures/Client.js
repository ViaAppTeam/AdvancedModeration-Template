import { readdirSync } from "fs";
import { connect } from "mongoose";
import { Client, GatewayIntentBits, Partials, Collection, ActivityType } from "discord.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const emojis = require("../../Config/emojis.json");

import * as dotenv from "dotenv";
dotenv.config({ path: "./src/Config/.env" });

export default class ViaAppTeam extends Client {
    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ],
            partials: [
                Partials.Channel
            ],
            presence: {
                status: "online",
                activities: [
                    {
                        name: "Bot is starting...",
                        type: ActivityType.Listening
                    },
                ]
            }
        });

        this.commands = new Collection();
        this.buttons = new Collection();
        this.modals = new Collection();
        this.emoji = global.emoji = emoji_name => emoji_name in emojis ? emojis[emoji_name] : "🎉";
        this.reply = global.reply = require(`../../Config/reply.json`);

    }

    async Init() {

        // Command Loader
        const commands = [];
        for (const dir of readdirSync("./src/Commands")) {
            for (const file of readdirSync(`./src/Commands/${dir}`)) {
                const command = await import(`../../Commands/${dir}/${file}`);
                this.commands.set(command.data.name, command.data);
                commands.push(command.data);
            };
        };

        this.on("ready", () => {
            this.application.commands.set(commands)
                .catch((err) => console.log(err));
        });

        // Button Loader
        for (const file of readdirSync("./src/Buttons")) {
            import(`../../Buttons/${file}`).then(button => {
                this.buttons.set(button.default.name, button.default);
            });
        };

        // Modal Loader
        for (const file of readdirSync("./src/Modals")) {
            import(`../../Modals/${file}`).then(modal => {
                this.modals.set(modal.default.name, modal.default);
            });
        };

        // Event Loader
        for (const file of readdirSync("./src/Events")) {
            const eventName = file.split(".")[0];
            this.on(eventName, (...args) => {
                import(`../../Events/${file}`).then(event => event.default(...args));
            });
        }

        // Database Connection
        connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).catch(() => console.log("MongoDB connection error."))

        this.login(process.env.TOKEN)
            .catch((err) => console.error(`API connection failed. ${err}`));

    };

}

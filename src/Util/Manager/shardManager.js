import { ShardingManager } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config({ path: "./src/Config/.env" });

const manager = new ShardingManager("./src/server.js", { token: process.env.TOKEN })

manager.spawn()
    .then(() => {
        console.log(`Soulcore connected the Discord API. `);
    });
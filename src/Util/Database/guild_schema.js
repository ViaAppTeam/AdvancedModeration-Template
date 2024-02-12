import { Schema, model } from "mongoose";

const data = new Schema({
    guildID: { type: String },
    autoRoleConfig: { type: Object },
    counterConfig: { type: Object },
    welcomerConfig: { type: Object }
});

export default model("guild_schema", data);
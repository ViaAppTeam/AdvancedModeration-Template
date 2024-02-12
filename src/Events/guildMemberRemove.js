import guildSchema from "../Util/Database/guild_schema.js";

/**
 * @param {import("discord.js").GuildMember} member
 */

export default async member => {

    let guildData = await guildSchema.findOne({ guildID: member.guild.id });

    const { guild } = member;
 
    // Counter
    let counterChannel = guildData?.counterConfig?.channel ? guildData?.counterConfig?.channel : null;
    let counterCount = guildData?.counterConfig?.count ? guildData?.counterConfig?.count : null;
    if (counterChannel != null && counterCount != null) {
        await member.guild.channels.fetch(counterChannel)
            .then(async channel => {
                channel.send({ content: `${emoji("user")} ${member}, aramızdan ayrıldı. **${member.guild.memberCount}** kişi kaldık ve **${counterCount}** kişi olmamıza **${counterCount - member.guild.memberCount}** kişi kaldı!` });
            })
            .catch(() => { });
    };

}
import config from "../Config/config.js";
import guildSchema from "../Util/Database/guild_schema.js";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

/**
 * @param {import("discord.js").GuildMember} member
 */

export default async member => {


    let guildData = await guildSchema.findOne({ guildID: member.guild.id });
    
    const { guild, client } = member;


    // AutoRole
    let autoRoleChannel = guildData?.autoRoleConfig?.channel ? guildData?.autoRoleConfig?.channel : null;
    let autoRoleRole = guildData?.autoRoleConfig?.role ? guildData?.autoRoleConfig?.role : null;
    let autoRoleMessage = guildData?.autoRoleConfig?.message ? guildData?.autoRoleConfig?.message : config.autoRole.DEFAULT_MESSAGE;

    if (autoRoleChannel != null && autoRoleRole != null) {
        await member.guild.channels.fetch(autoRoleChannel)
            .then(channel => {
                member.roles.add(autoRoleRole).catch(() => { });
                channel.send({ content: `${emoji("user")} ${autoRoleMessage.replace("{user}", member)}` });
            })
            .catch(() => { });
    };

    // Counter
    let counterChannel = guildData?.counterConfig?.channel ? guildData?.counterConfig?.channel : null;
    let counterCount = guildData?.counterConfig?.count ? guildData?.counterConfig?.count : null;
    if (counterChannel != null && counterCount != null) {
        await member.guild.channels.fetch(counterChannel)
            .then(async channel => {
                if (counterCount <= member.guild.memberCount) {
                    channel.send({ content: `${emoji("giveaway")} ${member}, aramıza katıldı. **${member.guild.memberCount}** kişi olduk ve **${counterCount}** hedefi tamamlandı!` });
                    await guildSchema.updateOne({ guildID: member.guild.id }, { $unset: { counterConfig: 1 } }).catch(() => { });
                } else {
                    channel.send({ content: `${emoji("user")} ${member}, aramıza katıldı. **${member.guild.memberCount}** kişi olduk ve **${counterCount}** kişi olmamıza **${counterCount - member.guild.memberCount}** kişi kaldı!` });
                };
            })
            .catch(() => { });
    };

}
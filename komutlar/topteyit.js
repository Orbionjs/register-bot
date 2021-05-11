const { MessageEmbed } = require("discord.js");
require('discord-reply');
const db = require("quick.db");
const moment = require("moment");
const conf = require('../config.json');
exports.run = async(client, message, args) => {
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
if(!message.member.roles.cache.has(conf.kayıtcıRol) && !message.member.hasPermission(8)) return message.react("❌")


    let data = await db.get(`teyit`) || {};

    let xd = Object.keys(data);
    let topteyit = xd.filter(dat => message.guild.members.cache.has(dat)).sort((a, b) => Number((data[b].e || 0) + (data[b].k || 0)) - Number((data[a].e || 0) + (data[a].k || 0))).map((value, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(value)} Toplam **${((data[value].e || 0) + (data[value].k || 0))}** (**${((data[value].e || 0))}** Erkek **${((data[value].k || 0))}** Kadın)`).splice(0, 15);

    message.lineReply(embed.setDescription(`${topteyit.join("\n") || "Teyit veritabanı bulunamadı!"}`)).catch().then(m => m.delete({ timeout: 15000 }))


}
exports.conf = {
    aliases: ['tt']
};
exports.help = {
    name:'topteyit',
    description:'Sunucunun Top 10 Teyitini listeler.'
}
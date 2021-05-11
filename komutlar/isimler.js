const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const conf = require('../config.json');

exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(conf.kayıtcıRol) && !message.member.hasPermission(8)) return message.react("❌")

    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let data = await db.fetch(`isimler.${uye.id}`)
    
    if (!data || !db.fetch(`isimler.${uye.id}`)) return message.channel.send(embed.setDescription(`Bu Kullanıcının geçmiş isimleri bulunamadı.`))
    let isimler = data.map((value, index) => `\`${index +1}.\` \`${value.isim}\` \`|\` Yetkili: **(**<@${value.yetkili}>**)** \`|\` Tarih: \`${new Date(value.zaman).toTurkishFormatDate()}\``).splice(0, 15)
    if (!uye) return message.channel.send(embed.setDescription(`Bir Kullanıcı Belirtmelisin`))

    message.channel.send(embed.setDescription(`
    ${uye}, Kullanıcısının toplam **${isimler.length}** kayıtı bulundu. 

    ${isimler.join("\n")}
    `))

}
exports.conf = {
    aliases:[]
};

exports.help = {
    name:'isimler',
    description:'Kullanıcının eski ismlerini listeler.'
}
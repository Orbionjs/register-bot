const { MessageEmbed, MessageAttachment } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const conf = require('../config.json');
exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(conf.kayıtcıRol) && !message.member.hasPermission(8)) return message.react("❌")

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.author;
    let embed = new MessageEmbed().setTimestamp().setColor("RANDOM")
                         //-------\\

        let erkek = await db.get(`kayıt.${member.id}.e`)
        let toplam = await db.get(`kayıt.${member.id}.t`)
        let kız = await db.get(`kayıt.${member.id}.k`)
        if(toplam === null) toplam = "0"
        if(toplam === undefined) toplam = "0"
        if(erkek === null) erkek = "0"
        if(erkek === undefined) erkek = "0"
        if(kız === null) kız = "0"
        if(kız === undefined) kız = "0"

                         //-------\\

        message.channel.send(embed.setDescription(`
        ${member}, Kullanıcısının teyit bilgileri;

        \`•\` Toplam kayıtların: \`${toplam}\`
        \`•\` Erkek kayıtların: \`${erkek}\`
        \`•\` Kadın kayıtların: \`${kız}\``)
        .setThumbnail(client.user.displayAvatarURL({ dynamic:true }))
        ).catch().then(qwe => qwe.delete({ timeout: 20000 }))

}
exports.conf = {
    aliases: ['tb']
};
exports.help = {
    name:'teyitbilgi',
    description:'Kullanıcının teyit verilerini gösterir.'
}
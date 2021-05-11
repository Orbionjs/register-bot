const { MessageEmbed } = require("discord.js");
const db = require("quick.db");
const moment = require("moment");
const conf = require('../config.json');
exports.run = async(client, message, args) => {

    if(!message.member.roles.cache.has(conf.kayıtcı) && !message.member.hasPermission(8)) return message.react("❌")

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let embed = new MessageEmbed().setColor('RANDOM').setTimestamp()
    if (!uye) return message.channel.send(embed.setDescription(`${message.author}, Bir Kullanıcı Etiketlemelisin.`)).then(m => m.delete({ timeout: 7000 }))

    args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if (!isim || !yaş) return message.channel.send(embed.setDescription(`${message.author}, Bir İsim Belirtmelisin.`)).then(m => m.delete({ timeout: 7000 }))
    let name = `${conf.xTag} ${isim} ' ${yaş}`
    if(uye.user.username.includes(conf.tag)) name = `${conf.tag} ${isim} ' ${yaş}` 

    if (uye.id === client.user.id) return message.channel.send(embed.setDescription(`Beni Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))
    if (uye.id === message.author.id) return message.channel.send(embed.setDescription(`Kendini Kayıt Edemezsin!`)).then(m => m.delete({ timeout: 7000 }))

    if (uye.roles.cache.has(conf.kızRolleri)) return message.channel.send(embed.setDescription(`Bu Kullanıcı Zaten Kayıtlı.`)).then(m => m.delete({ timeout: 7000 }))

    let veri = await db.get(`isimler.${uye.id}`)

        let isimlerr = veri.filter(uye => uye.userID === uye.id).map((value, index) => `\`${value.isim}\` **(**<@${value.yetkili}>**)** \`${new Date(value.zaman).toTurkishFormatDate()}\``).splice(0, 10)

        message.channel.send(new MessageEmbed() .setDescription(`
        ${uye} kişisinin ismi başarıyla \`${name}\` olarak değiştirildi, <@&837370821084971069> rolü verildi.

        ${isimlerr.join("\n") || "Kullanıcı daha önceden kayıt olmamış.."}
        `)).catch().then(m => m.delete({ timeout: 20000 }))
    

   uye.roles.add(conf.kızRolleri).catch(err => {})
    uye.roles.remove(conf.kayıtsızRol).catch(err => {})
    uye.setNickname(name)

    await db.add(`teyit.${message.author.id}.kadın`, 1)
    await db.add(`teyit.${message.author.id}.toplam`, 1)
    await db.push(`isimler.${uye.id}`, { isim: name, gender: conf.kızRolleri, yetkili: message.author.id, zaman: Date.now() })
}
exports.conf = {
    aliases: ['k']
};
exports.help = {
    name:'kız',
    description:'Kullanıcıyı kız olarak kaydeder.'
}
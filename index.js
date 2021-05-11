const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');
const process = require('process');

var prefix = config.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [KOMUT]: ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}. ${f}`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
if (!message.guild) {
return;
}
let permlvl = 0;
if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
if (message.author.id === config.sahip) permlvl = 4;
return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
client.on('warn', e => {
console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

Date.prototype.toTurkishFormatDate = function (format) {
  let date = this,
    day = date.getDate(),
    weekDay = date.getDay(),
    month = date.getMonth(),
    year = date.getFullYear(),
    hours = date.getHours(),
    minutes = date.getMinutes(),
    seconds = date.getSeconds();

  let monthNames = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");
  let dayNames = new Array("Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi");

  if (!format) {
    format = "dd MM yyyy, hh:ii:ss DD";
  };
  format = format.replace("mm", month.toString().padStart(2, "0"));
  format = format.replace("MM", monthNames[month]);
  
  if (format.indexOf("yyyy") > -1) {
    format = format.replace("yyyy", year.toString());
  } else if (format.indexOf("yy") > -1) {
    format = format.replace("yy", year.toString().substr(2, 2));
  };
  
  format = format.replace("dd", day.toString().padStart(2, "0"));
  format = format.replace("DD", dayNames[weekDay]);

  if (format.indexOf("HH") > -1) format = format.replace("HH", hours.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("hh") > -1) {
    if (hours > 24) hours -= 24;
    if (hours === 0) hours = 24;
    format = format.replace("hh", hours.toString().replace(/^(\d)$/, '0$1'));
  };
  if (format.indexOf("ii") > -1) format = format.replace("ii", minutes.toString().replace(/^(\d)$/, '0$1'));
  if (format.indexOf("ss") > -1) format = format.replace("ss", seconds.toString().replace(/^(\d)$/, '0$1'));
  return format;
};

const invites = {};
const wait = require("util").promisify(setTimeout);
client.on('ready', () => {
    wait(1000);
    client.guilds.cache.forEach(g => {
        g.fetchInvites().then(guildInvites => {
            invites[g.id] = guildInvites;
        });
    });
})

client.on("guildMemberAdd", async member => {
  require('moment-duration-format');
  const user = client.users.cache.get(member.id);

    const kurulus = user.createdAt.getTime(); 
    moment.locale("tr"); 
   const gecen = moment.duration(new Date().getTime() - user.createdAt.getTime()).format(` YY **[Yıl,]** DD **[Gün,]** HH **[Saat,]** mm **[Dakika,]** ss **[Saniye]**`) 

  var kontrol;
  if (kurulus < 1036800000)
    kontrol = "Güvenilir Değil <a:yukleniyor:835030959539224586>";
  if (kurulus > 1036800000)
    kontrol = "Güvenilir <a:yeah:835030960479141938>";

if(kurulus > 1036800000) { 
    member.roles.add("837370885714608129")
 } else { 
   member.roles.add("837370885714608129")
   member.roles.add("841649971156615201")
  }

    member.guild.fetchInvites().then(async guildInvites => {
        const ei = invites[member.guild.id];
        invites[member.guild.id] = guildInvites;
        const veri = await guildInvites.find(i => (ei.get(i.code) == null ? (i.uses - 1) : ei.get(i.code).uses) < i.uses);
        var daveteden;
        if (!veri) daveteden = "Bulunamadı"
        else daveteden = member.guild.members.cache.get(veri)
        var b = veri.guild.vanityURLCode
        if (!b) b = veri.code
        if (veri.code == b) daveteden = member.guild.members.cache.get(veri.inviter.id)
        else daveteden = member.guild;
        db.add(`davetsayi.${daveteden.id}.${member.guild.id}`, +1);
        db.add(`toplam.${daveteden.id}.${member.guild.id}`, +1);
        db.push(`günlük.${daveteden.id}.${member.guild.id}`, { userID: member.user.id })
        let zaman = require("moment").duration(new Date().getTime() - client.users.cache.get(member.id).createdAt.getTime())
        if (zaman < 1036800000) {
            db.add(`davetsayi.${daveteden.id}.${member.guild.id}`, -1);
            db.add(`fake.${daveteden.id}_${member.guild.id}`, +1);
        }
        db.set(`veri.${member.id}.${member.guild.id}`, daveteden.id);
        let a = await db.fetch(`davetsayi.${daveteden.id}.${member.guild.id}`);
        let davetsayi;
        if (!a) { davetsayi = 0; } else { davetsayi = await db.fetch(`davetsayi.${daveteden.id}.${member.guild.id}`); }
        var y;
        if (daveteden.id == member.guild.id) y = "Özel URL"
        else y = daveteden

client.channels.cache.get("834327007134744606").send(`
<a:donenkalp:835030964055965696> Sunucumuza hoşgeldin ${member}! (<@${y.id}> - \`${daveteden.id}\`) tarafından davet edildin.(\`${davetsayi} davet\` <a:danksw:838373499881652224>)

<a:yukleniyor2:835030959736225832> Hesabın \`${new Date(kurulus).toTurkishFormatDate()}\` tarihinde, ***${gecen}*** önce kurulmuş, **${kontrol}**.

<a:hyp:835030958494187562> Kayıt olmak için **<@&837580072915042337>** rolündeki yetkililer seninle ilgilenecektir.

<a:stars:835030959286910996> Sohbet etmeye başlamadan önce **<#834327007134744606>** kanalındaki kuralları okumanı tercih ederim.

Seninle beraber **${member.guild.memberCount}** kişiye ulaştık <a:tadaa:835030959694544937>.
`)

    })

})

 client.login(config.botToken);
const chalk = require("chalk");
const moment = require("moment");
const Discord = require("discord.js");
const ayarlar = require("../config.json");
var prefix = ayarlar.prefix;

module.exports = client => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] [CLIENT]: ${client.user.username} ismi ile giriş yapıldı!`);
 client.user.setStatus('idle')


 client.user.setActivity(`Serendia ❤️ Øʀchais`,  { type: `WATCHING` })

};


const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const client = new Discord.Client();
let wiernyRole="Wierny";
let prefix="*";
let zaproszeni={};
let wiadomosciChannel;
if (!fs.existsSync("info.json")) {fs.writeFileSync('info.json', JSON.stringify({}))};
let informacje = JSON.parse(fs.readFileSync('info.json'));


client.on('ready', () => {
  console.log(`Krystian nam sie objawil`);
  wiadomosciChannel=client.channels.cache.get("863124780131418112");
  wiadomosciChannel.setName("Wiadomosci: "+informacje.messages);
});

client.on('message', msg => {
  informacje = JSON.parse(fs.readFileSync('info.json'));
  if (msg.author.bot) {return;}
  informacje.messages++;
  wiadomosciChannel.setName("Wiadomosci: "+informacje.messages);

  let wierzy=msg.member.roles.cache.some(r => r.name === wiernyRole);
  const getCommand = function() {return msg.content.split(" ")}
  const getMeasage = function() {return msg.content.toLowerCase()}
  const send = function(txt) {msg.channel.send(txt)}
  console.log(informacje);

  if (!wierzy && zaproszeni[msg.author.id]==null && !msg.member.roles.cache.some(r => r.name == wiernyRole)) {
    send(`${msg.author} Zagubiona Istoto Czy Chesz Dołączyć Do Mojego Kościoła? (napisz "tak")`);
    zaproszeni[msg.author.id]=informacje.messages;
  }

  if (getCommand()[0].toLowerCase()=="nie" && zaproszeni[msg.author.id]!=null && !msg.member.roles.cache.some(r => r.name == wiernyRole)) {
    send("uznam że tego nie słyszałem")
  }


  if (getCommand()[0].toLowerCase()=="tak" && zaproszeni[msg.author.id]!=null && !msg.member.roles.cache.some(r => r.name == wiernyRole)) {
    var role= msg.member.guild.roles.cache.find(role => role.name === wiernyRole);
    wierzy=msg.member.roles.cache.some(r => r.name === wiernyRole)
    msg.member.roles.add(role);
    if (informacje.messages-zaproszeni[msg.author.id]>12) {
      send(`Długo myślałeś, ale ${msg.author} od teraz należysz do mojego kościoła`);
    }else if(informacje.messages-zaproszeni[msg.author.id]<3){
      send(`Szybka decyzja to lubie, ${msg.author} od teraz należysz do mojego kościoła`);
    }else{
      send(`${msg.author} od teraz należysz do mojego kościoła`);
    }

    delete zaproszeni[msg.author.id];
  }

  if (getCommand()[0]=="*ShowData") {
    send("nazwa roli: "+wiernyRole);
    send("prefix:" +prefix);
    send("magiczne rzeczy:");
    send(JSON.stringify(zaproszeni));
    send(JSON.stringify(informacje))

  }

  fs.writeFileSync('info.json',JSON.stringify(informacje));
});

client.login(JSON.parse(fs.readFileSync('token.txt', 'utf8')));

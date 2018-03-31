const botconfig = require("./botconfig.json");
const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});

bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  if(jsfile.length <= 0){
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) =>{
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity("Prefix = $", {type: "WATCHING"});

});


bot.on("guildMemberAdd", async member => {
  console.log(`${member.id} Has joined the server`);

  let welcomechannel = member.guild.channels.find(`name`, "general");
  welcomechannel.send(`${member} Welcome to gamer unicorn land, please read the #rules-and-regulations before chatting!:unicorn:`);
});


bot.on("guildMemberRemove", async member => {

  console.log(`${member.id} Has left the server`);

  let welcomechannel = member.guild.channels.find(`name`, "general");
  welcomechannel.send(`${member} Sad to see you go!`);

});


bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let commandfile = bot.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(bot,message,args);

});

bot.login(botconfig.token);

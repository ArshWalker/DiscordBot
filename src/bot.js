require("dotenv").config();

const { Client, webhookClient } = require('discord.js');
const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
  );

const prefix = "!";

client.on('ready', () => {
    console.log(`${client.user.tag} has logged in`);
}); 

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(prefix)) {
        const [cmd_name, ...args ] = message.content
            .trim()
            .substring(prefix.length)
            .split(/\s+/);
        if (cmd_name === 'kick'){
            if (!message.member.hasPermission(`KICK_MEMBERS`)) 
                return message.reply("You don't have permissions to use that command.");
            if (args.length === 0) 
                return message.reply('Please provide the ID.');
            const member = message.guild.members.cache.get(args[0]);
            if (member) {
                member
                    .kick()
                    .then((member) => message.channel.send(`${member} was kicked`))
                    .catch((err) => message.channel.send("I don't have permissions :( "));
            } else {
                message.channel.send('That member was not found');
            }
        } else if (cmd_name === 'ban'){
            if (!message.member.hasPermission(`BAN_MEMBERS`)) 
                return message.reply("You don't have permissions to use that command.");
            if (args.length === 0) 
                return message.reply('Please provide the ID.');
            
            try{
                const user = await message.guild.members.ban(args[0]);
                message.channel.send("User has been banned successfully.");
            } catch (err){
                console.log(err);
                message.channel.send("Error occured :( ");
            }
        }else if (cmd_name === 'announce') {
            console.log(args);
            const msg = args.join(' ');
            console.log(msg);
            webhookClient.send(msg);
          }
    }
});

client.on('messageReactionAdd', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '738666523408990258') {
      switch (name) {
        case '🍎':
          member.roles.add('738664659103776818');
          break;
        case '🍌':
          member.roles.add('738664632838782998');
          break;
        case '🍇':
          member.roles.add('738664618511171634');
          break;
        case '🍑':
          member.roles.add('738664590178779167');
          break;
      }
    }
});

client.on('messageReactionRemove', (reaction, user) => {
    const { name } = reaction.emoji;
    const member = reaction.message.guild.members.cache.get(user.id);
    if (reaction.message.id === '738666523408990258') {
      switch (name) {
        case '🍎':
          member.roles.remove('738664659103776818');
          break;
        case '🍌':
          member.roles.remove('738664632838782998');
          break;
        case '🍇':
          member.roles.remove('738664618511171634');
          break;
        case '🍑':
          member.roles.remove('738664590178779167');
          break;
      }
    }
});

client.login(process.env.DISCORDJS);


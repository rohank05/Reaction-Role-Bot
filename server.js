
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
require('dotenv').config();
const fs = require('fs');
var rolID;
var msgID;
const mysql = require('mysql');
var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'reaction'

});
con.connect(err=>{
    if(err) throw err;
    console.log("connected to Database")
    con.query(`DESCRIBE reactrole`,(err,rows)=>{
        if(err){
            con.query(`CREATE TABLE reactrole(
                roleid varchar(30) not null,
                emoid varchar(20) not null,
                messageid varchar(20) not null
            )`,()=>{
                
            })
            
        }
        
            
        
    })
    
})


client.on('ready',() => {
    console.log("May the force be with you")
})
client.login(process.env.BOT_TOKEN);
//read commands from folder commands
client.commands = new Discord.Collection();
var commands = fs.readFileSync('storage/commands.txt', 'utf-8')
function loadCmds() {
    fs.readdir('./commands/', (err, files) => {
        if (err) console.error(err);
  
        var jsfiles = files.filter(f => f.split('.').pop() === 'js');
        if (jsfiles.length <= 0) {
         return console.log('No commands  found');
        } else {
            console.log(jsfiles.length + 'commands found');
        }
        jsfiles.forEach((f, i) => {
        delete require.cache[require.resolve(`./commands/${f}`)];
        var cmds = require(`./commands/${f}`);
        console.log(`commands ${f} is loading......`)
        client.commands.set(cmds.config.command, cmds);
      })
    })
}


loadCmds();

client.on('message', message=>{
    
    var prefix = "!";
    var cont = message.content.slice(prefix.length).split(' ');
    var args = cont.slice(1);
    var cmd = client.commands.get(cont[0])
    if (cmd) {
        cmd.run(client, message, args, con);
    }

    if(message.content === prefix+'reload'){
        if(message.author.id != '687893451534106669') return;
        loadCmds();
        message.channel.send("All Commands have been reloaded")
    }
    if(message.content === prefix+'help'){
        const embed = new Discord.MessageEmbed()
        .setAuthor(client.user.username, client.user.displayAvatarURL())
        .setDescription(commands);
        message.channel.send(embed);
      }

  client.user.setStatus('Online');
  client.user.setActivity('Reaction Videos', {type: 'WATCHING'});

})
client.on('messageReactionAdd', async (reaction, user)=>{
    if(reaction.message.partial) {
        await reaction.message.fetch()
    }
    if(user.bot) return;

    
    var emote = reaction.emoji.id;
    
    
    con.query(`SELECT roleid FROM reactrole WHERE emoid = '${emote}' AND messageid = '${reaction.message.id}'`, (err, rows)=>{
        if(err) throw err;
        if(rows.length>0){
            rolID = rows[0].roleid
            var role = reaction.message.guild.roles.cache.find(role=>role.id===rolID);
            var member = reaction.message.guild.members.cache.find(member=> member.id=== user.id)
            member.roles.add(role);
        }
    })
})

client.on('messageReactionRemove', async (reaction, user)=>{
    if(reaction.message.partial) {
        await reaction.message.fetch()
    }
    if(user.bot) return;
    var emote = reaction.emoji.id;
    con.query(`SELECT roleid FROM reactrole WHERE emoid = '${emote}' AND messageid = '${reaction.message.id}'`, (err, rows)=>{
        if(err) throw err;
        if(rows.length>0){
            rolID = rows[0].roleid
            var role = reaction.message.guild.roles.cache.find(role=>role.id===rolID);
            var member = reaction.message.guild.members.cache.find(member=> member.id=== user.id)
            member.roles.remove(role);
        }
    })
})



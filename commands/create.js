var reactChannel;
const Discord = require('discord.js')
var cancel;
module.exports.run = async (client,message,args,con)=>{
    guildID = message.guild.id;
    if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("You don't have correct permission")
    
    await message.channel.send("Enter the channel you want the reaction role to be set up in.");    
    let answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max: 1}).then((collected)=>{
        cancel = collected.first().content; 
        reactChannel = collected.first().content.slice(2,-1)
        
    })
    if(cancel.toUpperCase() === 'CANCEL') return(message.channel.send("The Process Has Been Cancelled!"))


    await message.channel.send("How many reaction role you want to create in one set?")
    answer = await message.channel.awaitMessages(answer => answer.author.id != client.user.id,{max: 1});
    const n = (answer.map(answers => answers.content).join())
    if(n.toUpperCase()==='CANCEL') return (message.channel.send("The Process Has Been Cancelled!"))
    if(isNaN(n)) return message.channel.send("Enter a Number")
    
    await message.channel.send("Enter the title for the set of reactions.");    
    answer = await message.channel.awaitMessages(answer => answer.author.id != client.user.id,{max: 1})
    const embtitle = (answer.map(answers => answers.content).join())
    if(embtitle.toUpperCase()==='CANCEL') return (message.channel.send("The Process Has Been Cancelled!"))
    var a = []
    var b = []
    var c = []
    for(var i =0; i<n;i++){
        
        
        await message.channel.send("Add a description for the role.")
        answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max: 1});
        b[i] = (answer.map(answers => answers.content).join())
        if(b[i].toUpperCase()==='CANCEL'){
            message.channel.send("The Process Has Been Cancelled!")
            return;

        } 
        

        await message.channel.send("Mention the role.")
        answer = await message.channel.awaitMessages(answer => answer.content,{max: 1}).then((collected)=>{
            cancel = collected.first().content; 
            c[i]=collected.first().content.slice(3,-1);
            
        })
        if(cancel.toUpperCase() === 'CANCEL') return(message.channel.send("The Process Has Been Cancelled!"))
        
        await message.channel.send("Enter the emoji to be used.")
        answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max: 1});
        a[i] = (answer.map(answers => answers.content).join())
        if(a[i].toUpperCase()==='CANCEL') return (message.channel.send("The Process Has Been Cancelled!"))
        
    }
    await message.channel.send("Give the color for the embed.")
        answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max: 1});
        var color = (answer.map(answers => answers.content).join()).toUpperCase()
        if(color.toUpperCase()==='CANCEL') return (message.channel.send("The Process Has Been Cancelled!"))
    function embstr(){
        var finalString = '';
        for(var i =0;i<n;i++){
            
            finalString += b[i]+ ' - '+a[i] +'\n';
        }
        return finalString;
    }
    
    
    const embed = new Discord.MessageEmbed()
        .setTitle(embtitle)
        .setColor("color")
        .setDescription(embstr());

    const guild = client.guilds.cache.get(guildID);
    const botmsg = await guild.channels.cache.find(channel => channel.id === reactChannel).send(embed);


    for(var i = 0;i<n;i++){
        var emoid = a[i].slice(1,-1)
        emoid = emoid.split(':')
        emoid = emoid[2];
                const embedMsg = botmsg.embeds.find(msg => msg.title === embtitle);
                
                if(embedMsg){
                    await botmsg.react(emoid)
                }
            
        }
        for(var i =0; i<n;i++){
            var emoname = a[i].split(':')
            con.query(`INSERT INTO reactrole VALUES('${c[i]}','${emoname[1]}','${embtitle}')`)
        }
}

module.exports.config = {
    command: 'create'
}

var roleid;
module.exports.run = async (client,message,args,con) => {
    await message.channel.send("Enter the message ID.");
    let answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max:1})
    var msgID = (answer.map(answers=>answers.content).join())

    await message.channel.send("Mention the role.");
    answer = await message.channel.awaitMessages(answer => answer.content,{max: 1}).then((collected)=>{ 
    roleid =collected.first().content.slice(3,-1);
    })   

    await message.channel.send("Enter the emoji to be used.")
    answer = await message.channel.awaitMessages(answer => answer.author.id === message.author.id,{max: 1});
    var emoji = (answer.map(answers => answers.content).join())
    var emoid = emoji.slice(1,-1)
    emoid = emoid.split(':')
    emoid = emoid[2];
        
    

    message.channel.messages.fetch({around: msgID, limit: 1}).then(messages => {
     
        messages.first().react(emoid)
        
  });
  con.query(`INSERT INTO reactrole VALUES('${roleid}','${emoid}','${msgID}')`)
  

}
module.exports.config = {
    command: 'custom'
}

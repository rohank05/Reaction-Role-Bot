module.exports.run = async(client, message, args, con)=>{
    if(!args) return message.channel.send("Please enter the command in correct order ```clear <message title>```")
    var finalString = '';
    for(var i = 0; i<args.length;i++){
        finalString += args[i]
        if(args[i+1]){
            finalString += ' '
        }
    }
    
    con.query(`DELETE FROM reactrole WHERE title='${finalString}'`,(err)=>{
        if(err) return(message.channel.send("Please insert the correct title"))
        else{
            return(message.channel.send("Please delete the message. The roles has been cleared"))
        }
    })

}

module.exports.config = {
    command: 'clear'
}
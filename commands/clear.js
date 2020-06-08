module.exports.run = async(client, message, args, con)=>{
    if(!message.member.hasPermission('MANAGE_ROLES')) return message.channel.send("You don't have correct permission")

    if(!args.length) return message.channel.send("Please enter the command in correct order ```clear <message id>```")
    
    
    con.query(`DELETE FROM reactrole WHERE messageid='${args[0]}'`,(err)=>{
        if(err) return(message.channel.send("Please insert the correct title"))
        else{
            return(message.channel.send("Please delete the message. The roles has been cleared"))
        }
    })

}

module.exports.config = {
    command: 'clear'
}

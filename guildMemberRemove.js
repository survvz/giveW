module.exports = class {
  constructor (client) {
    this.client = client;
  }

  run (member) {
    this.client.db.query(`SELECT \`message\`, \`channel\`, \`guild\`, \`emoji\` FROM \`giveaways\` WHERE guildjoin = ${member.guild.id}`, result => {
      if (!result) return;
      for (var i in result) {
        const guild = this.client.guilds.find(x => x.id === result[i].guild);
        const channel = guild.channels.find(x => x.id === result[i].channel);
        channel.messages.fetch(result[i].message).then(msg => {
          const reaction = msg.reactions.get(result[i].emoji);
          if (!reaction) return;
          reaction.users.fetch().then(users => {
            if (users.some(user => user.id === member.user.id)) {
              msg.reactions.get(result[i].emoji).users.remove(member.user);
            }
          });
        });
      }
    });
  }
};

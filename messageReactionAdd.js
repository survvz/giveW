const Discord = require('discord.js');
module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (reaction, user) {
    function embed (description) {
      return new Discord.MessageEmbed()
        .setAuthor('Giveaways.wtf')
        .setColor('679ddb')
        .setDescription(description);
    }
    if (reaction.message.partial) {
      try {
        await reaction.message.fetch();
      } catch (error) {
        console.log('Something went wrong when fetching the message: ', error);
      }
    }

    this.client.db.query(`SELECT \`guildjoin\` FROM \`giveaways\` WHERE message = ${this.client.db.connection.escape(reaction.message.id)}`, async result => {
      const giveaway = result[0];
      if (!giveaway) return;
      if (!giveaway.guildjoin) return;
      const guild = this.client.guilds.find(x => x.id === giveaway.guildjoin);
      const members = await guild.members.fetch();
      console.log(members.size);
      if (!members.some(x => x.user.id === user.id)) {
        reaction.users.remove(user);
        user.send(embed(`You need to join **${guild.name}** to enter this giveaway!`))
          .catch(() => console.log('Could not send a message that the user needs to join a guild!'));
      }
    });
  }
};

const Base = require('../base/Command');

class End extends Base {
  constructor (client) {
    super(client, {
      name: 'end',
      description: 'Force end a giveaway!',
      usage: 'end <name>',
      args: 1
    });
  }

  run (message, args) {
    const client = this.client;
    const embed = this.embed();
    const name = args.join(' ');
    this.client.db.query(`SELECT * FROM \`giveaways\` WHERE name = ${this.client.db.connection.escape(name)} AND guild = ${this.client.db.connection.escape(message.guild.id)} AND ended = FALSE`, result => {
      if (result.length < 1) return message.channel.send(embed.setDescription('I didn\'t find a giveaway with that name!'));
      const giveaway = result[0];
      this.client.giveaway.end(client, giveaway.message)
        .then(() => message.channel.send(embed.setDescription('Giveaway ended!')));
    });
  }
}

module.exports = End;

const Base = require('../base/Command');

class Stop extends Base {
  constructor (client) {
    super(client, {
      name: 'stop',
      description: 'Force stop a giveaway! (This will just stop the giveaway. No one will win.)',
      usage: 'stop <name>',
      args: 1
    });
  }

  run (message, args) {
    const client = this.client;
    const embed = this.embed();
    const name = args.join(' ');
    this.client.db.query(`SELECT * FROM \`giveaways\` WHERE name = ${this.client.db.connection.escape(name)} AND guild = ${this.client.db.connection.escape(message.guild.id)} AND ended = FALSE`, result => {
      if (result.length < 1) return message.channel.sstop(embed.setDescription('I didn\'t find a giveaway with that name!'));
      const giveaway = result[0];
      this.client.giveaway.stop(client, giveaway.message)
        .then(() => message.channel.send(embed.setDescription('Giveaway force stopped!')));
    });
  }
}

module.exports = Stop;

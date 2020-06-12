const Base = require('../base/Command');

class ReRoll extends Base {
  constructor (client) {
    super(client, {
      name: 'reroll',
      description: 'Force reroll a giveaway! (This will just reroll the giveaway. No one will win.)',
      usage: 'reroll <name>',
      args: 1
    });
  }

  run (message, args) {
    const client = this.client;
    const embed = this.embed();
    const name = args.join(' ');
    this.client.db.query(`SELECT * FROM \`giveaways\` WHERE name = ${this.client.db.connection.escape(name)} AND guild = ${this.client.db.connection.escape(message.guild.id)} AND ended = TRUE`, result => {
      if (result.length < 1) return message.channel.sreroll(embed.setDescription('I didn\'t find a giveaway with that name!'));
      const giveaway = result[0];
      this.client.giveaway.reroll(client, giveaway.message)
        .then(() => message.channel.send(embed.setDescription('Giveaway rerolled!')));
    });
  }
}

module.exports = ReRoll;

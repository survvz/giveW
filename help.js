const Base = require('../base/Command');

class Help extends Base {
  constructor (client) {
    super(client, {
      name: 'help',
      description: 'Shows all commands.',
      usage: 'help',
      aliases: ['h']
    });
  }

  run (message) {
    let embed = this.embed('Help Menu');
    var i = 0;
    this.client.commands.forEach(cmd => {
      if (message.channel.permissionsFor(message.member).has(cmd.conf.permission)) {
        if (cmd.conf.roles.length !== 0) {
          if (message.member.roles.some(r => cmd.conf.roles.includes(r.name)) === false) {
            return;
          }
        }
        i++;
        if (i > 25) {
          super.respond(embed);
          embed.fields = [];
          i = 0;
        }
        embed = embed
          .addField(`${this.client.config.prefix}${cmd.help.usage}`, cmd.help.description);
      }
    });
    super.respond(embed);
  }
}

module.exports = Help;

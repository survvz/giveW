module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run (message) {
    const Discord = require('discord.js');
    if (!message.author.id) {
      return;
    }
    if (!message.guild) return;
    if (message.member == null) {
      await message.guild.fetchMember(message.author.id).then(member => {
        message.member = member;
      });
    }
    const embed = new Discord.MessageEmbed()
      .setAuthor('Giveaways.wtf')
      .setColor(0xff0000);
    if (!message.content.startsWith(this.client.config.prefix)) return;
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(this.client.config.prefix.length);
    const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
    if (!cmd) {
      return;
    }
    if (message.channel.permissionsFor(message.member).has(cmd.conf.permission)) {
      if (cmd.cooldown.has(message.author.id)) {
        message.channel.send(embed.setDescription('This command is in cooldown for you!'));
        return;
      }

      if (cmd.conf.roles.length !== 0) {
        if (message.member.roles.some(r => cmd.conf.roles.includes(r.name)) === false) {
          message.channel.send(embed.setDescription('You dont have the right permissions for this command!\nRoles that can access this: ' + cmd.conf.roles.join(', ')));
          return;
        }
      }
      if (args.length < cmd.conf.args) {
        message.channel.send(embed.setDescription(`${this.client.config.prefix}${cmd.help.usage}`));
        return;
      }
      cmd.setMessage(message);
      cmd.run(message, args);
      if (cmd.conf.cooldown > 0) cmd.startCooldown(message.author.id);
    } else {
      message.channel.send(embed.setDescription('You dont have the right permissions for this command!'));
    }
  }
};

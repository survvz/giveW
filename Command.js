const Discord = require('discord.js');
/**
 * Represents a command
 */
class Command {
  /**
     * @param {CustomClient} client The client used in the command
     * @param {Object} options The command's configuration
     */
  constructor (client, options) {
    /**
         * The client used in the command
         * @type {CustomClient}
         */
    this.client = client;
    /**
         * The command's information properties
         * @type {Object}
         */
    this.help = {
      name: options.name || null,
      description: options.description || 'No information specified.',
      usage: options.usage || ''
    };
    /*
         * The command's configuration
         * @type {Object}
         */
    this.conf = {
      permission: options.permission || 'SEND_MESSAGES',
      cooldown: options.cooldown || 1000,
      aliases: options.aliases || [],
      allowDMs: options.allowDMs || false,
      args: options.args || false,
      roles: options.roles || []
    };
    /**
         * A set of the IDs of the users on cooldown
         * @type {Set}
         */
    this.cooldown = new Set();

    this.embed = description => {
      return new Discord.MessageEmbed()
        .setAuthor('Giveaways.wtf')
        .setColor('679ddb')
        .setDescription(description);
    };
  }

  /**
     * Puts a user on cooldown
     * @param {String} user The ID of the user to put on cooldown
     */
  startCooldown (user) {
    // Adds the user to the set
    this.cooldown.add(user);

    // Removes the user from the set after the cooldown is done
    setTimeout(() => {
      this.cooldown.delete(user);
    }, this.conf.cooldown);
  }

  setMessage (message) {
    this.message = message;
  }

  respond (message) {
    this.message.channel.send(message);
  }
}

module.exports = Command;

const db = require('./db.js');
const time = require('./time.js');
const Discord = require('discord.js');
const embed = new Discord.MessageEmbed()
  .setAuthor('Giveaways.wtf')
  .setColor('679ddb');
module.exports.create = (client, name, description, duration, winmessage, winners, channel, guild, emoji, guildjoin, invite, message) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT COUNT(*) FROM \`giveaways\` WHERE guild = ${db.connection.escape(guild.id)} AND ended = FALSE;`, result => {
      if (result[0][Object.keys(result[0])[0]] > 10) {
        return reject(new Error('You already have 10 giveaways on going in this guild!'));
      }
      // Calculate time
      const end = new Date();
      end.setSeconds(end.getSeconds() + duration);
      // Emoji
      if (emoji.custom) {
        emoji = emoji.id;
      } else {
        emoji = emoji.name;
      }
      // Invite

      db.query(`INSERT INTO \`giveaways\`(\`name\`, \`description\`, \`winmessage\`, \`winners\`, \`channel\`, \`guild\`, \`emoji\`, \`guildjoin\`, \`invite\`, \`message\`, \`end\`) VALUES (${db.connection.escape(name)},${db.connection.escape(description)},${db.connection.escape(winmessage)},${db.connection.escape(winners)},${db.connection.escape(channel.id)},${db.connection.escape(guild.id)},${db.connection.escape(emoji)},${db.connection.escape(guildjoin.id)},${db.connection.escape(invite)},${db.connection.escape(message.id)},${db.connection.escape(end)})`, (result) => {
        resolve();
      });
    });
  });
};

module.exports.loopGiveaways = (client) => {
  const giveaway = this;
  return new Promise((resolve, reject) => {
    let i = -1; // (\`name\`, \`description\`, \`winmessage\`, \`winners\`, \`channel\`, \`guild\`, \`emoji\`, \`guildjoin\`, \`message\`, \`end\`)
    db.query('SELECT * FROM `giveaways`', result => {
      function loopGiveaway (i) {
        if (result[i].ended === 1) {
          giveaway.checkRemoveDB(client, result[i].message, result[i].end).then(() => {
            next();
          });
        } else {
          giveaway.updateGiveaway(client, result[i].name, result[i].description, result[i].winmessage, result[i].winners, result[i].channel, result[i].guild, result[i].emoji, result[i].guildjoin, result[i].invite, result[i].message, result[i].end).then(() => {
            next();
          });
        }
      }
      function next () {
        i++;
        if (i >= result.length) {
          return resolve();
        }
        loopGiveaway(i);
      }
      next();
    });
  });
};

module.exports.checkRemoveDB = (client, message, end) => {
  return new Promise((resolve, reject) => {
    const difference = Math.round((new Date().getTime() - end.getTime()) / 1000);
    if (difference > client.config.removeendedgiveawaydatabase) {
      db.query(`DELETE FROM \`giveaways\` WHERE message=${message}`);
    }
    resolve();
  });
};

module.exports.updateGiveaway = (client, giveawayname, giveawaydescription, giveawaywinmessage, giveawaywinners, giveawaychannel, giveawayguild, giveawayemoji, giveawayguildjoin, giveawayinvite, giveawaymessage, giveawayend) => {
  const updateGiveaway = this;
  return new Promise((resolve, reject) => {
    const name = giveawayname;
    const description = giveawaydescription;
    const maxwinners = parseInt(giveawaywinners);
    const emoji = giveawayemoji;
    const guildjoin = client.guilds.find(x => x.id === giveawayguildjoin);
    const invite = giveawayinvite;
    if (invite) {
      invite.replace('https://', '');
      invite.replace('http://', '');
    }

    const difference = Math.round((giveawayend.getTime() - new Date().getTime()) / 1000);

    // Fetch message
    const guild = client.guilds.find(x => x.id === giveawayguild);
    const channel = guild.channels.find(x => x.id === giveawaychannel);
    channel.messages.fetch(giveawaymessage).then(msg => {
      if (difference > 0) {
        const duration = time.out(difference);
        msg.edit(embed.setAuthor(`${name} (${maxwinners > 1 ? maxwinners + ' winners' : '1 winner'})`).setDescription(`${description === 'none' ? '' : description + '\n\n'}React with ${emoji.length > 2 ? guild.emojis.find(x => x.name === emoji) : emoji} to enter!\nTime remaining: ${duration}${invite ? '\n**Requirements:**\n[» You need to join ' + guildjoin.name + '](https://' + invite + ')' : ''}`).setFooter('Ends').setTimestamp(giveawayend)).then(() => {
          resolve();
        });
      } else {
        updateGiveaway.end(client, msg.id).then(() => {
          resolve();
        });
      }
    });
  });
};

module.exports.end = (client, message) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM \`giveaways\` WHERE message = ${db.connection.escape(message)}`, result => {
      const giveaway = result[0];
      const name = giveaway.name;
      const description = giveaway.description;
      const winmessage = giveaway.winmessage.toString();
      const maxwinners = parseInt(giveaway.winners);
      const emoji = giveaway.emoji;
      const guild = client.guilds.find(x => x.id === giveaway.guild);
      const channel = guild.channels.find(x => x.id === giveaway.channel);
      channel.messages.fetch(giveaway.message).then(msg => {
        const reactions = msg.reactions.get(emoji);
        if (!reactions) {
          msg.edit(embed.setDescription('Reaction not found! This giveaway was auto canceled!'));
          db.query(`DELETE FROM \`giveaways\` WHERE message=${giveaway.message}`);
          return resolve();
        }
        reactions.users.fetch().then(users => {
          users = users.array().filter(u => u.id !== msg.author.id);
          var winners = [];
          for (var j = 0; j < maxwinners; j++) {
            var n = Math.floor(Math.random() * users.length);
            if (users.length >= 1) {
              winners.push(users[n]);
              users.splice(n, 1);
            }
          }
          if (winners.length < 1) {
            winners = ['No One :('];
          }

          winners.forEach(w => {
            var newmessage = winmessage.replace('{winner}', w);
            newmessage = newmessage.replace('{prize}', `**${name}**`);
            msg.channel.send(newmessage);
          });

          db.query(`UPDATE \`giveaways\` SET \`ended\`=TRUE WHERE message=${db.connection.escape(giveaway.message)}`);
          msg.edit(embed.setAuthor(`${name} (${maxwinners > 1 ? maxwinners + ' winners' : '1 winner'})`).setDescription(`${description === 'none' ? '' : description + '\n\n'}${maxwinners > 1 ? 'Winners: ' : 'Winner: '} ${winners}`).setFooter('Ended')).then(() => {
            resolve();
          });
        });
      });
    });
  });
};

module.exports.stop = (client, message) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT * FROM \`giveaways\` WHERE message = ${db.connection.escape(message)}`, result => {
      const giveaway = result[0];
      const name = giveaway.name;
      const description = giveaway.description;
      const maxwinners = parseInt(giveaway.winners);
      const guild = client.guilds.find(x => x.id === giveaway.guild);
      const channel = guild.channels.find(x => x.id === giveaway.channel);
      channel.messages.fetch(giveaway.message).then(msg => {
        db.query(`UPDATE \`giveaways\` SET \`ended\`=TRUE WHERE message=${db.connection.escape(giveaway.message)}`);
        msg.edit(embed.setAuthor(`${name} (${maxwinners > 1 ? maxwinners + ' winners' : '1 winner'})`).setDescription(`${description === 'none' ? '' : description + '\n\n'}This giveaway was force stopped! (No winners)`).setFooter('Ended')).then(() => {
          resolve();
        });
      });
    });
  });
};

module.exports.reroll = (client, message) => {
  const reroll = this;
  return new Promise((resolve, reject) => {
    db.query(`UPDATE \`giveaways\` SET \`ended\`=FALSE WHERE message=${db.connection.escape(message)}`, result => {
      reroll.end(client, message).then(() => resolve());
    });
  });
};

process
  .on('uncaughtException', err => console.error(err.stack))
  .on('unhandledRejection', err => console.error(err.stack));
// .setMaxListeners(0);
console.log('Starting...');
// Import custom client
const Client = require('./base/Client');

// Initialise client
const client = new Client({
  config: './config',
  clientOptions: {
    partials: ['MESSAGE', 'CHANNEL']
  }
});

// Login with config token
client.login(client.config.token);
// Load commands
client.loadCommands(client.config.paths.commands);
// Load events
client.loadEvents(client.config.paths.events);
const Discord = require('discord.js');
const embed = new Discord.MessageEmbed()
  .setAuthor('Error:')
  .setColor(0xff0000);
process
  .on('uncaughtException', err => client.channels.find(r => r.name === 'logs').send(embed.setDescription('```js\n' + err.stack + '```')))
  .on('unhandledRejection', err => client.channels.find(r => r.name === 'logs').send(embed.setDescription('```js\n' + err.stack + '```')));

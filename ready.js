module.exports = class {
  constructor (client) {
    this.client = client;
  }

  run () {
    console.log(`Client started. Node version: ${process.version}. Platform: ${process.platform}. PID ID: ${process.pid}. User ID: ${this.client.user.id}\nStarting to loop giveaways...`);
    this.client.user.setActivity('giveaways.wtf | -help', {
      type: 'WATCHING'
    });

    // Check if giveaway table exists
    this.client.db.query(`SELECT EXISTS(SELECT * FROM information_schema.tables WHERE table_schema = "${this.client.config.database.database}" AND table_name = "giveaways");`, result => {
      if (result[0][Object.keys(result[0])[0]] === 1) {
        console.log('Found giveaways table in database!');
      } else {
        console.log('I can\'t find giveaways table! Creating...');
        this.client.db.query('CREATE TABLE `giveaways` (`name` text NOT NULL, `description` text NOT NULL, `winmessage` text NOT NULL, `winners` text NOT NULL, `channel` text NOT NULL, `guild` text NOT NULL, `invite` text DEFAULT NULL, `emoji` text NOT NULL, `guildjoin` text DEFAULT NULL, `message` text NOT NULL, `end` timestamp NOT NULL DEFAULT current_timestamp(), `ended` tinyint(1) NOT NULL DEFAULT 0) ENGINE=InnoDB DEFAULT CHARSET=utf8;', result => {
          console.log('Created giveaways table!');
        });
      }
    });

    const ready = this;
    function run () {
      ready.client.giveaway.loopGiveaways(ready.client)
        .then(() => {
          setTimeout(() => run(), ready.client.config.giveawayeditcooldown);
        });
    }
    run();
  }
};

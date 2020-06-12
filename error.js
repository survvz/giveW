module.exports = class {
  constructor (client) {
    this.client = client;
  }

  run (error) {
    console.error(error.ReferenceError);
    console.error('ERROR. It can be that it needs to be restarted. It should automatic reconnect.');
  }
};

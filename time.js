module.exports.out = (t) => {
  // console.log(t)
  t = parseInt(t) * 1000;
  var minutes = Math.floor((t / 1000 / 60) % 60);
  var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  var days = Math.floor(t / (1000 * 60 * 60 * 24));
  var seconds = Math.floor((t / 1000) % 60);
  // console.log(`${days} days. ${hours} hours. ${minutes} minutes. ${seconds}.`)
  if (days > 1) {
    if (hours > 1) {
      return `**${days}** days **${hours}** hours`;
    } else {
      return `**${days}** days **${hours}** hour`;
    }
  } else {
    if (days === 1) {
      if (hours > 1) {
        return `**${days}** day **${hours}** hours`;
      } else {
        return `**${days}** day **${hours}** hour`;
      }
    } else {
      if (hours > 1) {
        if (minutes > 1) {
          return `**${hours}** hours **${minutes}** minutes`;
        } else {
          return `**${hours}** hours **${minutes}** minute`;
        }
      } else {
        if (hours === 1) {
          if (minutes > 1) {
            return `**${hours}** hour **${minutes}** minutes`;
          } else {
            return `**${hours}** hour **${minutes}** minute`;
          }
        } else {
          if (minutes > 1) {
            return `**${minutes}** minutes`;
          } else {
            if (minutes === 1) {
              if (seconds > 1) {
                return `**${minutes}** minute **${seconds}** seconds`;
              } else {
                return `**${minutes}** minute **${seconds}** second`;
              }
            } else {
              return `**${seconds}** seconds`;
            }
          }
        }
      }
    }
  }
};

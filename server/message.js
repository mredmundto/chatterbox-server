var Message = function(username, text) {
  var date = new Date();
  var dateStr = date.toISOString();

  this.createdAt = dateStr;
  this.objectId = date.valueOf();
  this.roomname = 'lobby';
  this.text = text;
  this.updatedAt = dateStr;
  this.username = username;
};

module.exports = Message;
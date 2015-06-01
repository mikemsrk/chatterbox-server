// /////////////////////////////////////////
// BACKBONE.JS IMPLEMENTATION
// /////////////////////////////////////////
var Message = Backbone.Model.extend({
  url: 'https://api.parse.com/1/classes/chatterbox',
  defaults: {
    username: ''
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'https://api.parse.com/1/classes/chatterbox',

  loadMessages: function () {
    this.fetch({data: {order: '-createdAt'}});
  },

  parse: function (response, options) {
    var output = [];

    for (var i = response.results.length-1; i>=0; i--) {
      output.push(response.results[i]);
    }

    return output;
  }
});

var MessageView = Backbone.View.extend({
  model: Message,

  template: _.template(['<li class="well">',
        '<div class="username"><%-username%></div>',
        '<div class="msgText"><%-text%></div>',
        '<div><%-roomname%></div>',
      '</li>',].join('')),

  render: function () {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }
});

var MessagesView = Backbone.View.extend({
  initialize: function () {
    this.collection.on('sync', this.render, this);
    this.onScreenMessages = {};
  },

  render: function () {
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(item){
    // if it's not currently on screen
    if (!this.onScreenMessages[item.get('objectId')]){
      this.onScreenMessages[item.get('objectId')] = true;
      var newMessageView = new MessageView({model:item});
      this.$el.prepend(newMessageView.render());
    }
  }
});

var SubmitView = Backbone.View.extend({

  events: {
    'click .submit': 'doSubmit'
  },

  doSubmit: function(e){
    e.preventDefault();

    var $text = this.$('#message');
    var $roomname = this.$('#roomname');
    this.collection.create({
      username: window.location.search.substr(10),
      text: $text.val(),
      roomname: $roomname.val()
    });
    $text.val('');
    $roomname.val('');
  },

});

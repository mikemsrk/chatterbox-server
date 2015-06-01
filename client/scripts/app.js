// /////////////////////////////////////////
// BACKBONE.JS IMPLEMENTATION
// /////////////////////////////////////////
var Message = Backbone.Model.extend({
  url: 'http://127.0.0.1:3000/classes/chatterbox/',
  defaults: {
    username: ''
  }
});

var Messages = Backbone.Collection.extend({
  model: Message,
  url: 'http://127.0.0.1:3000/classes/chatterbox',

  loadMessages: function () {
    this.fetch();
  },

  parse: function (response, options) {
    var output = [];

    // for (var i = response.results.length-1; i>=0; i--) {
    //   output.push(response.results[i]);
    // }
    for (var i = 0; i < response.results.length; i++) {
      output.push(response.results[i]);
    };

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
    // clears the feed (we can do this without flashing since line 47 syncs)
    this.$el.html('');
    // render
    this.collection.forEach(this.renderMessage, this);
  },

  renderMessage: function(item){
    // if it's not currently on screen
    // if (!this.onScreenMessages[item.get('objectId')]){
    //   this.onScreenMessages[item.get('objectId')] = true;
      var newMessageView = new MessageView({model:item});
      this.$el.prepend(newMessageView.render());
    // }
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
    var data = {
      username: window.location.search.substr(10),
      text: $text.val(),
      roomname: $roomname.val()
    };
    this.collection.create(data);
    $text.val('');
    $roomname.val('');
  },

});

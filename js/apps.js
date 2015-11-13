var todo = Backbone.Model.extend({
  url: 'http://tiny-starburst.herokuapp.com/collections/postjase',

  defaults: {
    "todo": ""
  }
});

var todos = Backbone.Collection.extend({
  url: 'http://tiny-starburst.herokuapp.com/collections/postjase'
});

////////////////////////////////////////////////////////////////////////////////
var homeView = Backbone.View.extend({
  tag: 'section',
  template: _.template($('#todoHome').html()),

  events: {
    'keypress #newTodoText': 'handleEnter'
  },

  send: function (){
    var todoValue = this.$('#newTodoText').val();

    var newTodo = new todo ({
      todo : todoValue
    });

    newTodo.save();
  },

  render: function(){
    this.$el.html(this.template());
  },

  handleEnter: function(event){
   if(event.keyCode === 13){
     event.preventDefault();
     console.log('sent!');
     this.send();
   }
 },
});

////////////////////////////////////////////////////////////////////////////////

var todoListView = Backbone.View.extend({
  // tag: 'section',
  template: _.template($('#todoPost').html()),

  render: function(){
    this.$el.html(this.template({
      todos: this.collection.toJSON()
    }));
    return this;
  }
});

////////////////////////////////////////////////////////////////////////////////

var todoRouter = Backbone.Router.extend({
  routes: {
    "": "home"
  },

  home: function() {
    console.log('hi');
    var view = new homeView();
    view.render();
    $('#mainArea').html(view.$el);

    var collection = new todo();
    var listView = new todoListView({
      collection: collection
    });

    collection.fetch({
      success: function(){
      listView.render();
      $('#listArea').html(listView.el);
    }
  })
}
});

var router = new todoRouter();
Backbone.history.start();

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

  initialize: function (){
    this.listenTo(this.collection, 'fetch sync', this.render);
 },

  send: function (){
    var todoValue = this.$('#newTodoText').val();

    // this.collection.create({
    //    todo : todoValue
    // });
    var newTodo = new todo ({
      todo : todoValue
    });

    newTodo.save();
  },

  render: function(){
    this.$el.html(this.template());

    return this;
  },

  handleEnter: function(event){
   if(event.keyCode === 13){
     event.preventDefault();
     console.log('sent!');
     this.send();
     $('#newTodoText').val("");
    }
   },

});

////////////////////////////////////////////////////////////////////////////////

var todoListView = Backbone.View.extend({
  template: _.template($('#todoPost').html()),

  events: {
    'keypress #editTodo': 'handleEnter2',
    'click #deleteBtn': 'onRemove'
  },

  initialize: function (){
    this.listenTo(this.model, 'destroy', this.remove);
  },

  send: function (){
    var todoValue = this.$('#editTodo').val();
  },

  render: function(){
    this.$el.html(this.template({
      todos: this.collection.toJSON()
    }));
    return this;
  },

  handleEnter2: function(event){
   if(event.keyCode === 13){
     event.preventDefault();
     console.log('sent!');
     this.send();
     $('#editTodo').val("");
   }
 },

   onRemove: function() {
    this.model.destroy();
  }
});

////////////////////////////////////////////////////////////////////////////////

var todoRouter = Backbone.Router.extend({
  routes: {
    "": "home",
    "active": "active",
    "completed": "completed"
  },

  home: function() {
    console.log('hi');
    var collection = new todo();
    var view = new homeView({
      collection: collection
      }
    );
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
  });

  var model = new todo();

    model.on('change', {
      success: function(){
      listView.render();
      $('#listArea').html(listView.el);
      }
    });
}

  // active: function(){
  //
  // }
});

var router = new todoRouter();
Backbone.history.start();

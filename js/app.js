(function() {
  var ENTER_KEY = 13;

  ko.bindingHandlers.enterKey = {
    init: function(element, valueAccessor, allBindingsAccessor, data) {
      var gatedHandler = function(data, event) {
        if(event.keyCode === ENTER_KEY) {
          valueAccessor().call(this, data, event);
        }
      };

      var gatingAccessor = function() {
        return {
          keyup: gatedHandler,
        };
      };

      ko.bindingHandlers.event.init(element, gatingAccessor, allBindingsAccessor, data);
    },
  };
})();

(function() {
  var Todo = function(title, completed) {
    this.title = ko.observable(title);
    this.completed = ko.observable(completed);
    this.editing = ko.observable(false);
  }

  var Filter = function(title, url, selected) {
    this.title = ko.observable(title);
    this.url = ko.observable(url);
    this.selected = ko.observable(selected);
  }

  var viewModel = (function() {
    var todos = ko.observableArray([new Todo("checked", true), new Todo("unchecked", false)]);
    var currentTodoTitle = ko.observable();

    var todosExist = ko.computed(function() {
      return 0 < todos().length;
    });

    var deleteTodo = function(todo) {
      todos.remove(todo);
    };

    var addNewTodo = function() {
      var trimmedTitle = currentTodoTitle() && currentTodoTitle().trim();
      if(trimmedTitle) {
        todos.unshift(new Todo(currentTodoTitle(), false));
        currentTodoTitle("");
      }
    };

    var itemsLeftCount = ko.computed(function() {
      return ko.utils.arrayFilter(todos(), function(todo) {
        return !todo.completed();
      }).length;
    });

    var allCompleted = ko.computed({
      read: function() {
        return 0 == itemsLeftCount();
      },
      write: function(value) {
        ko.utils.arrayForEach(todos(), function(todo) {
          todo.completed(value);
        });
      }
    });

    var pluralize = function(input, count) {
      return (1 == count) ? input : input + "s";
    }

    var filters = ko.observableArray([new Filter("All", "#", true),
                                      new Filter("Active", "#/active", false),
                                      new Filter("Completed", "#/completed", false)]);

    return {
      currentTodoTitle: currentTodoTitle,
      todos: todos,
      addNewTodo: addNewTodo,
      deleteTodo: deleteTodo,
      todosExist: todosExist,
      itemsLeftCount: itemsLeftCount,
      allCompleted: allCompleted,
      filters: filters,
      pluralize: pluralize,
    };
  })();

  ko.applyBindings(viewModel);
})();

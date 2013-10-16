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

  var Filter = function(title, url, filterFunction) {
    this.title = ko.observable(title);
    this.url = ko.observable(url);
    this.filterFunction = filterFunction;
  }

  var viewModel = (function() {
    var todos = ko.observableArray([new Todo("completed example", true), new Todo("active example", false)]);
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

    var filters = ko.observableArray([
        new Filter("All", "#/", function(todo) { return true; }),
        new Filter("Active", "#/active", function(todo) { return !todo.completed(); }),
        new Filter("Completed", "#/completed", function(todo) { return todo.completed(); }),
    ]);

    var currentFilter = ko.observable();

    var setFilter = function(filter) {
      currentFilter(filter);
    };

    var filteredTodos = ko.computed(function() {
      var filterFunction = currentFilter() && currentFilter().filterFunction
                            ? currentFilter().filterFunction
                            : function(todo) { return true; };
      return ko.utils.arrayFilter(todos(), filterFunction);
    });

    setFilter(filters()[0]);

    return {
      currentTodoTitle: currentTodoTitle,
      todos: todos,
      addNewTodo: addNewTodo,
      deleteTodo: deleteTodo,
      todosExist: todosExist,
      itemsLeftCount: itemsLeftCount,
      allCompleted: allCompleted,
      filters: filters,
      currentFilter: currentFilter,
      setFilter: setFilter,
      filteredTodos: filteredTodos,
      pluralize: pluralize,
    };
  })();

  ko.applyBindings(viewModel);

  var sammy = Sammy(function() {
    var self = this;
    ko.utils.arrayForEach(viewModel.filters(), function(filter) {
      self.get(filter.url(), function() {
        viewModel.setFilter(filter);
      });
    });
  });
  sammy.run(viewModel.currentFilter().url());
})();

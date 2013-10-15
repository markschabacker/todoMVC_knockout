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

    var todosExist = ko.computed(function() {
      return 0 < todos().length;
    });

    var deleteTodo = function(todo) {
      todos.remove(todo);
    };

    var itemsLeftCount = ko.computed(function() {
      return 42;
    });

    var filters = ko.observableArray([new Filter("All", "#", true),
                                      new Filter("Active", "#/active", false),
                                      new Filter("Completed", "#/completed", false)]);

    return {
      todos: todos,
      deleteTodo: deleteTodo,
      todosExist: todosExist,
      itemsLeftCount: itemsLeftCount,
      filters: filters,
    };
  })();

  ko.applyBindings(viewModel);
})();

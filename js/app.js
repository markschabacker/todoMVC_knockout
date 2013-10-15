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
    var filters = ko.observableArray([new Filter("All", "#", true),
                                      new Filter("Active", "#/active", false),
                                      new Filter("Completed", "#/completed", false)]);

    var todosExist = ko.computed(function() {
      return 0 < todos().length;
    });

    var itemsLeftCount = ko.computed(function() {
      return 42;
    });

    return {
      todos: todos,
      todosExist: todosExist,
      itemsLeftCount: itemsLeftCount,
      filters: filters,
    };
  })();

  ko.applyBindings(viewModel);
})();

 var budgetController = (function() {
     var Expense = function(ID, description, value) {
         this.ID = ID,
             this.description = description,
             this.value = value
     };
     var Income = function(ID, description, value) {
         this.ID = ID,
             this.description = description,
             this.value = value
     };
     var calculateTotal = function(type) {
         var sum = 0;
         data.allItems[type].forEach(function(cur) {
             sum += cur.value;
         });
         data.total[type] = sum;
     }
     var data = {
         allItems: {
             exp: [],
             inc: []
         },
         total: {
             exp: 0,
             inc: 0
         },
         budget: 0,
         percentages: -1
     }
     return {
         addItem: function(type, des, value) {
             var newItem, ID = 0;

             if (data.allItems[type].length > 0) {
                 ID = data.allItems[type][data.allItems[type].length - 1].ID + 1;
             }

             if (type === 'exp') {
                 newItem = new Expense(ID, des, value);
             } else {
                 newItem = new Income(ID, des, value);
             }
             data.allItems[type].push(newItem);
             return newItem;
         },

         calculateBudget: function() {
             //calculate the total income or expense
             calculateTotal('exp');
             calculateTotal('inc');
             //calculate budget: income-expense
             data.budget = data.total.inc - data.total.exp;

             //calculate the percentages of income that we spent
             if (data.total.inc > 0)
                 data.percentages = Math.round((data.total.exp / data.total.inc) * 100);
             else
                 data.percentages = -1;
         },
         getBudget: function() {
             return {
                 budget: data.budget,
                 totalIncome: data.total.inc,
                 totalExpense: data.total.exp,
                 percentages: data.percentages

             }
         },
         deleteItem(type, id) {
             var ids, index;
             // data.allItems[type]

             ids = data.allItems[type].map(function(current) {
                 return current.ID;
             });

             // ids.indexOf(id);
             index = ids.indexOf(id);
             console.log(index);

             console.log(index);
             if (index !== -1) {
                 data.allItems[type].splice(index, 1);
             }
         },
         testing: function() {
             return data;
         }
     }
 })();


 var UIController = (function() {

     var DomStrings = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputButton: '.add__btn',
         incomeContainer: '.income__list',
         expenseContainer: '.expenses__list',
         budgetLabel: '.budget__value',
         budgetIncome: '.budget__income--value',
         budgetExpense: '.budget__expenses--value',
         percentages: '.budget__expenses--percentage',
         Container: '.container'
     };
     return {
         getInput: function() {
             return {
                 type: document.querySelector(DomStrings.inputType).value,
                 description: document.querySelector(DomStrings.inputDescription).value,
                 value: parseFloat(document.querySelector(DomStrings.inputValue).value)
             }
         },
         getDomStrings: function() {
             return DomStrings;
         },
         addListItem: function(obj, type) {
             var html, element, newHtml;
             if (type === 'inc') {
                 element = DomStrings.incomeContainer;
                 html = ' <div class="item clearfix" id="inc-%ID%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div> '
             } else if (type === 'exp') {
                 element = DomStrings.expenseContainer;
                 html = '<div class="item clearfix" id="exp-%ID%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div><div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>  </div> </div> </div>'
             }
             newHtml = html.replace('%ID%', obj.ID);
             newHtml = newHtml.replace('%description%', obj.description);
             newHtml = newHtml.replace('%value%', obj.value);

             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
         },
         displayBudget: function(obj) {
             document.querySelector(DomStrings.budgetLabel).textContent = obj.budget;
             document.querySelector(DomStrings.budgetIncome).textContent = obj.totalIncome;
             document.querySelector(DomStrings.budgetExpense).textContent = obj.totalExpense;

             if (obj.percentages > 0) {
                 document.querySelector(DomStrings.percentages).textContent = obj.percentages + '%';
             } else {
                 document.querySelector(DomStrings.percentages).textContent = '---';

             }
         },
         deleteListItem: function(selectorID) {
             var el = document.getElementById(selectorID);
             el.parentNode.removeChild(el);
         },
         clearFields: function() {
             var fields, fieldArr;

             fields = document.querySelectorAll(DomStrings.inputDescription + ',' + DomStrings.inputValue);

             fieldArr = Array.prototype.slice.call(fields);

             fieldArr.forEach(function(current, index, Array) {
                 current.value = "";
             });
             fields[0].focus;
         }
     }
 })();


 var Controller = (function(budgetCntl, UICntl) {
     var inputs;
     setupEvenListener = function() {
         var Dom = UICntl.getDomStrings();
         document.querySelector(Dom.inputButton).addEventListener('click', addCntlItem);
         document.addEventListener('keypress', function(event) {
             if (event.keyCode == 13 || event.which == 13) {
                 addCntlItem();
             }
         });
         document.querySelector(Dom.Container).addEventListener('click', deleteCntlItem);
     }

     updateBudget = function() {
         //calculate budget
         budgetCntl.calculateBudget();
         //return budget
         var budget = budgetCntl.getBudget();

         //display budget to the UI00
         UICntl.displayBudget(budget);
     }
     addCntlItem = function() {
         inputs = UIController.getInput();
         //  testing(inputs);
         if (inputs.description !== '' && !isNaN(inputs.value) && inputs.value !== 0) {
             var item = budgetCntl.addItem(inputs.type, inputs.description, inputs.value);

             UICntl.addListItem(item, inputs.type);

             UICntl.clearFields();

             updateBudget();
         }
     }
     deleteCntlItem = function(event) {
         var itemId, splitId, type, ID;
         itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
         //  console.log(itemId);
         if (itemId) {
             splitId = itemId.split('-');
             type = splitId[0];
             ID = parseInt(splitId[1]);
             // console.log(splitId);
             // console.log(type + '      ' + ID);

             //1. Delete a iteam from the Data structure
             budgetCntl.deleteItem(type, ID);
             //2. Delete a iteam from the UI
             UICntl.deleteListItem(itemId);
             //3. Calculate and show the new budget
             updateBudget();
         }
         // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

     }
     return {
         init: function() {
             console.log('Application started');
             UICntl.displayBudget({
                 budget: 0,
                 totalIncome: 0,
                 totalExpense: 0,
                 percentages: 0
             });
             setupEvenListener();
         }

     }

 })(budgetController, UIController);

 Controller.init();
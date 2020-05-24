 var budgetController = (function() {
     var Expense = function(ID, description, value) {
         this.ID = ID,
             this.description = description,
             this.value = value,
             this.percentage = -1
     };
     Expense.prototype.calcPercentage = function(totalIncome) {
         if (totalIncome > 0) {
             this.percentage = Math.round((this.value / totalIncome) * 100);
         }
     };
     Expense.prototype.getPercentage = function() {
         return this.percentage;
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
     };
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

         calculatePercentages: function() {

             data.allItems.exp.forEach(function(cur) {
                 cur.calcPercentage(data.total.inc);
             });
         },
         getPercestages: function() {
             var allPrac = data.allItems.exp.map(function(cur) {
                 return cur.getPercentage();
             });
             return allPrac;
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
         Container: '.container',
         expenseLable: '.item__percentage',
         monthYearLable: '.budget__title--month'
     };

     var formatNumber = function(type, number) {
         var numSplit, int, dec;
         number = Math.abs(number);
         number = number.toFixed(2);
         numSplit = number.split('.');
         int = numSplit[0];

         dec = numSplit[1];
         if (int.length > 3) {
             int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
         }
         return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
     };
     var nodeListForFunction = function(list, callBack) {
         for (var i = 0; i < list.length; i++) {

             callBack(list[i], i);
         }
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
             newHtml = newHtml.replace('%value%', formatNumber(type, obj.value));

             document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

         },
         displayBudget: function(obj) {
             var type;
             (obj.budget > 0 ? type = 'inc' : type = 'exp')

             document.querySelector(DomStrings.budgetLabel).textContent = formatNumber(type, obj.budget);
             document.querySelector(DomStrings.budgetIncome).textContent = formatNumber('inc', obj.totalIncome);
             document.querySelector(DomStrings.budgetExpense).textContent = formatNumber('exp', obj.totalExpense);

             if (obj.percentages > 0) {
                 document.querySelector(DomStrings.percentages).textContent = obj.percentages + '%';
             } else {
                 document.querySelector(DomStrings.percentages).textContent = '---';

             }
         },
         displayPercentages: function(percentages) {
             var fields = document.querySelectorAll(DomStrings.expenseLable);
             nodeListForFunction(fields, function(current, index) {
                 if (percentages[index] > 0) {
                     current.textContent = percentages[index] + '%';
                 } else {
                     current.textContent = '---';
                 }
             });
         },
         displayDate: function() {
             var now, Months, month, year;
             Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
             now = new Date();
             year = now.getFullYear();
             month = now.getMonth();

             document.querySelector(DomStrings.monthYearLable).textContent = Months[month] + ',' + year;

         },
         deleteListItem: function(selectorID) {
             var el = document.getElementById(selectorID);
             el.parentNode.removeChild(el);
         },
         changeType: function() {
             console.log('slkjflsd');
             var fields = document.querySelectorAll(
                 DomStrings.inputType + ',' +
                 DomStrings.inputDescription + ',' +
                 DomStrings.inputValue
             );

             nodeListForFunction(fields, function(cur) {
                 cur.classList.toggle('red-focus');
             });

             document.querySelector(DomStrings.inputButton).classList.toggle('red');
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
         document.querySelector(Dom.inputType).addEventListener('change', UICntl.changeType);
     }

     updateBudget = function() {
         //calculate budget
         budgetCntl.calculateBudget();
         //return budget
         var budget = budgetCntl.getBudget();

         //display budget to the UI00
         UICntl.displayBudget(budget);
     }
     updatePercentages = function() {
         //1. Calculate percentages
         budgetCntl.calculatePercentages();
         //2. Read percentages from the budget controller
         var percentages = budgetCntl.getPercestages();
         //3. Update the UI with the new percentages
         UICntl.displayPercentages(percentages);
     }

     addCntlItem = function() {
         inputs = UIController.getInput();
         //  testing(inputs);
         if (inputs.description !== '' && !isNaN(inputs.value) && inputs.value !== 0) {
             var item = budgetCntl.addItem(inputs.type, inputs.description, inputs.value);

             UICntl.addListItem(item, inputs.type);

             UICntl.clearFields();

             updateBudget();

             updatePercentages();
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

             //4. calculate percentages of each expenses
             updatePercentages();

         }
         // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

     }
     return {
         init: function() {
             console.log('Application started');
             UICntl.displayDate();
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
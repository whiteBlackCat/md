// 利用组合,委托思想.保持开闭原则.  方便复用,扩展

// 策略对象  每个校验规则前3个参数固定必传  依赖倒置??
var validationStrategies = {
  isNoEmpty: function (element, errMsg, value) {
    if (value === '') {
      return this.buildInvalidObj(element, errMsg, value);
    }
  },
  minLength: function (element, errMsg, value, length) {
    if (value.length < length) {
      return this.buildInvalidObj(element, errMsg, value);
    }
  },
  maxLength: function (element, errMsg, value, length) {
    if (value.length > length) {
      return this.buildInvalidObj(element, errMsg, value);
    }
  },
  isMail: function (element, errMsg, value, length) {
    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (!reg.test(value)) {
      return this.buildInvalidObj(element, errMsg, value);
    }
  }
};

// 验证器
function InputValidators() {
  this.validators = [];
  this.strategies = {};
}
//从策略对象导入验证策略函数
//参数:
// strategies: 包含各种策略函数的对象
InputValidators.prototype.importStrategies = function (strategies) {
  for (var strategyName in strategies) {
    this.addValidationStrategy(strategyName, strategies[strategyName]);
  }
};
//添加验证策略函数
//参数:
// name: 策略名称
// strategy: 策略函数
InputValidators.prototype.addValidationStrategy = function (name, strategy) {
  this.strategies[name] = strategy;
};

// 添加验证方法
// 参数:
// rule: 验证策略字符串
// element: 被验证的dom元素
// errMsg: 验证失败时显示的提示信息
// value: 被验证的值
InputValidators.prototype.addValidator = function (rule, element, errMsg, value) {
  var that = this;
  var ruleElements = rule.split(":");
  this.validators.push(function () {
    var strategy = ruleElements.shift();
    var params = ruleElements;
    params.unshift(value);
    params.unshift(errMsg);
    params.unshift(element);
    return that.strategies[strategy].apply(that, params);
  });
};
// check函数来调用所有的验证。 并将错误的结果进行返回
InputValidators.prototype.check = function () {
  for (var i = 0, validator; validator = this.validators[i++];) {
    var result = validator();
    if (result) {
      return result;
    }
  }
};

// 策略模式似乎有两个特点:
// 1. 数量有限的算法; 2. 类似的实现方式
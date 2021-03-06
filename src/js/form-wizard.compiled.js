'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormWizardClass = function () {

	/**
  * Constructor
  * @param  {DOM Element} wrapper
  * @param  {object} options
  * @return {void}
  */
	function FormWizardClass(wrapper, options) {
		_classCallCheck(this, FormWizardClass);

		this.wrapper = wrapper;
		this.options = this._initOptions(options);
		this.events = this.options.events;

		this._initElements();
		this._initForm();

		this._runEvent('ready');
	}

	/**
  * Merge default options with given object
  * @param  {object} options
  * @return {void}
  */


	_createClass(FormWizardClass, [{
		key: '_initOptions',
		value: function _initOptions(options) {
			var defaultOptions = {
				events: {
					ready: function ready() {},
					beforeStepChange: function beforeStepChange() {},
					afterStepChange: function afterStepChange() {},
					submit: function submit() {}
				},
				methods: {
					moveStep: function moveStep(index) {
						this.moveStep(index);
					}
				},
				activeClass: 'active'
			};

			if (options) {
				return Object.assign(defaultOptions, options);
			}

			return defaultOptions;
		}

		/**
   * Set private elements
   * @return {void}
   */

	}, {
		key: '_initElements',
		value: function _initElements() {
			this.buttonsNavigation = {
				prev: this.wrapper.querySelector('.form-wizard-prev'),
				submit: this.wrapper.querySelector('.form-wizard-submit'),
				next: this.wrapper.querySelector('.form-wizard-next')
			};

			this.stepsNavigation = this.wrapper.querySelectorAll('.form-wizard-step');
			this.steps = this.wrapper.querySelectorAll('[id^="step-"]');

			if (this.wrapper.tagName === 'FORM') {
				this.form = this.wrapper;
			} else {
				this.form = this.wrapper.querySelector('form');
			}
		}

		/**
   * Trigger event
   * @param  {string} eventName name of event from possible events list
   * @param  {any} args	arguments which should be passed
   * @return {void}
   */

	}, {
		key: '_runEvent',
		value: function _runEvent(eventName, args) {
			if (this.events[eventName]) {
				this.events[eventName](args);
			}
		}

		/**
   * Initialize form. Add events, active class, etc
   * @return {void}
   */

	}, {
		key: '_initForm',
		value: function _initForm() {
			var _this = this;

			this.steps.not(0).hide();
			this.activeStepIndex = 0;
			this.buttonsNavigation.prev.hide();
			this.moveStep(this.activeStepIndex);

			this.buttonsNavigation.next.addEventListener('click', function (event) {
				if (_this.activeStepIndex + 1 <= _this.steps.length - 1) {
					_this.moveStep(++_this.activeStepIndex);
				}

				if (_this.activeStepIndex == _this.steps.length - 1) {
					_this.buttonsNavigation.next.hide();
				}

				if (_this.activeStepIndex > 0) {
					_this.buttonsNavigation.prev.show();
				}
			});

			this.buttonsNavigation.prev.addEventListener('click', function (event) {
				if (_this.activeStepIndex - 1 >= 0) {
					_this.moveStep(--_this.activeStepIndex);
				}

				if (_this.activeStepIndex == 0) {
					_this.buttonsNavigation.prev.hide();
				}

				if (_this.activeStepIndex < _this.steps.length - 1) {
					_this.buttonsNavigation.next.show();
				}
			});

			this.form.addEventListener('submit', function (event) {
				_this._runEvent('submit', event);
			});
		}

		/**
   * Go to step with some index
   * @param  {number} index index of step
   * @return	{void}
   */

	}, {
		key: 'moveStep',
		value: function moveStep(index) {
			var _this2 = this;

			this._runEvent('beforeStepChange', event);

			var activeStep = this.steps.hide()[index];
			this.steps.not(index).forEach(function (step) {
				step.removeClass(_this2.options.activeClass);
			});
			activeStep.show().addClass(this.options.activeClass);

			var activeStepNav = this.stepsNavigation[index];
			this.stepsNavigation.not(index).forEach(function (stepNav) {
				stepNav.removeClass(_this2.options.activeClass);
			});
			activeStepNav.addClass(this.options.activeClass);

			this._runEvent('afterStepChange', event);

			return this;
		}
	}]);

	return FormWizardClass;
}();

NodeList.prototype.not = function (index) {
	var nodesList = [];

	this.forEach(function (node, i) {
		if (i != index) {
			nodesList.push(node);
		}
	});

	return nodesList;
};
NodeList.prototype.hide = function () {
	this.forEach(function (node) {
		node.hide();
	});

	return this;
};

Array.prototype.hide = function () {

	this.forEach(function (element) {
		element.hide();
	});

	return this;
};

Element.prototype.hide = function () {
	this.displayOldValue = window.getComputedStyle(this).getPropertyValue('display');
	this.style.display = 'none';

	return this;
};
Element.prototype.show = function () {
	if (this.displayOldValue && this.displayOldValue != 'none') {
		this.style.display = this.displayOldValue;
	} else {
		this.style.display = 'block';
	}

	return this;
};
Element.prototype.addClass = function (className) {
	if (this.className.indexOf(className) == -1) {
		this.className += ' ' + className;
	}
	return this;
};
Element.prototype.removeClass = function (className) {
	if (this.className.indexOf(className) > -1) {
		this.className = this.className.replace(className, '');
	}
	return this;
};

Element.prototype.formWizard = function (options) {
	return new FormWizardClass(this, options);
};
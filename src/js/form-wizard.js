
class FormWizardClass {

	/**
	 * Constructor
	 * @param  {DOM Element} wrapper
	 * @param  {object} options
	 * @return {void}
	 */
	constructor(wrapper, options) {
		this.wrapper = wrapper;
		this.options = this._initOptions(options);
		this.events = this.options.events;

		this._initElements();
		this._initForm();

		this._runEvent('ready');
	}

	/**
	 * Merge default options with given object
	 * @param  {[type]} options [description]
	 * @return [type]           [description]
	 */
	_initOptions(options) {
		const defaultOptions = {
			events: {
				ready: function() {},
				beforeStepChange: function() {},
				afterStepChange: function() {},
				submit: function() {},
			},
			methods: {

			},
			activeClass: 'active'
		}

		if (options) {
			return Object.assign(defaultOptions, options);
		}

		return defaultOptions;
	}

	/**
	 * Set private elements
	 * @return {void}
	 */
	_initElements() {
		this.buttonsNavigation = {
			prev: this.wrapper.querySelector('.form-wizard-prev'),
			submit: this.wrapper.querySelector('.form-wizard-submit'),
			next: this.wrapper.querySelector('.form-wizard-next')
		}

		this.stepsNavigation = this.wrapper.querySelectorAll('.form-wizard-step');
		this.steps = this.wrapper.querySelectorAll('[id^="step-"]');
	}

	/**
	 * Trigger event
	 * @param  {string} eventName name of event from possible events list
	 * @param  {any} args	arguments which should be passed
	 * @return {void}
	 */
	_runEvent(eventName, args) {
		if (this.events[eventName]) {
			this.events[eventName](args);
		}
	}

	/**
	 * Initialize form. Add events, active class, etc
	 * @return {void}
	 */
	_initForm() {
		this.steps.not(0).hide();
		this.activeStepIndex = 0;
		this.buttonsNavigation.prev.hide();
		this.moveStep(this.activeStepIndex);

		this.buttonsNavigation.next.addEventListener('click', event => {
			if (this.activeStepIndex + 1 <= this.steps.length - 1) {
				this.moveStep(++this.activeStepIndex);
			}

			if (this.activeStepIndex == this.steps.length - 1) {
				this.buttonsNavigation.next.hide();
			}

			if (this.activeStepIndex > 0) {
				this.buttonsNavigation.prev.show();
			}
		});

		this.buttonsNavigation.prev.addEventListener('click', event => {
			if (this.activeStepIndex - 1 >= 0) {
				this.moveStep(--this.activeStepIndex);
			}

			if (this.activeStepIndex == 0) {
				this.buttonsNavigation.prev.hide();
			}

			if (this.activeStepIndex < this.steps.length - 1) {
				this.buttonsNavigation.next.show();
			}
		});
	}

	/**
	 * Go to step with some index
	 * @param  {number} index index of step
	 * @return	{void}
	 */
	moveStep(index) {
		this._runEvent('beforeStepChange', event);

		let activeStep = this.steps.hide()[index];
		this.steps.not(index).forEach(step => {
			step.removeClass(this.options.activeClass);
		});
		activeStep.show().addClass(this.options.activeClass);

		let activeStepNav = this.stepsNavigation[index];
		this.stepsNavigation.not(index).forEach(stepNav => {
			stepNav.removeClass(this.options.activeClass);
		});
		activeStepNav.addClass(this.options.activeClass);

		this._runEvent('afterStepChange', event);
	}
}


NodeList.prototype.not = function(index) {
	var nodesList = [];

	this.forEach((node, i) => {
		if (i != index) {
			nodesList.push(node);
		}
	});

	return nodesList;
}
NodeList.prototype.hide = function() {
	this.forEach(node => {
		node.hide();
	});

	return this;
}

Array.prototype.hide = function() {

	this.forEach(element => {
		element.hide();
	});

	return this;
}

Element.prototype.hide = function() {
	this.displayOldValue = window.getComputedStyle(this).getPropertyValue('display');
	this.style.display = 'none';

	return this;
}
Element.prototype.show = function() {
	if (this.displayOldValue && this.displayOldValue != 'none') {
		this.style.display = this.displayOldValue;
	} else {
		this.style.display = 'block';
	}

	return this;
}
Element.prototype.addClass = function(className) {
	if (this.className.indexOf(className) == -1) {
		this.className += ' ' + className;
	}
	return this;
}
Element.prototype.removeClass = function(className) {
	if (this.className.indexOf(className) > -1) {
		this.className = this.className.replace(className, '');
	}
	return this;
}



Element.prototype.formWizard = function(options) {
	return new FormWizardClass(this, options);
};



document.getElementById('form').formWizard();

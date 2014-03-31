(function ( $ ) {

	$.widget("msi.instructor", {
		
		options : {
			steps : []
		},

		_create : function () {
			this.steps = this.options.steps;
			this.currentStep = this.steps[0];
			this.currentTip = this.currentStep.tips[0];
		},

		_getById : function ( id ) {
			var $el = $('#' + id);
			if($el.length) {
				return $el;
			} else {
				console.error('No element found with id "' + id + '"');
			}
		},

		_getByAttr : function ( attrName, attrVal ) {
			if(!attrVal) {
				return $('[' + attrName + ']'); 
			}
			return $('[' + attrName + '="' + attrVal + '"]');
		},

		_getStepByName : function ( name ) {
			var step;
			$.each(this.steps, function ( index, item ) {
				if(item.title == name) {
					step = item;
				}
			});

			if (!step) {
				throw new Error('Step "' + name + '" was not found');
			}

			return step;
		},

		_getStepIndex : function ( step ) {
			return this.steps.indexOf(step);
		},

		_getTipIndex : function ( tip ) {
			return this.currentStep.tips.indexOf(tip);
		},

		tooltip : function ( id, message, title ) {
			var $el = this._getById(id);
			var options = {
				target: true,
				tipJoint:"left",
				targetJoint: "right",
				showOn: "creation",
				hideTrigger: 'closeButton',
				hideOn: [],
				offset: [-20, 0]
			};
			var tooltip = new Opentip($el, message, title, options);
		},

		goToStep : function ( title ) {
			var $stepLabel = this._getByAttr('data-instruct-step', title)
				, step = this._getStepByName(title);
			this.currentStep = step;
			this.currentTip = step.tips[0];
			if(step.onStart) {
				step.onStart.call(step);
			}
		},

		nextStep : function () {
			var currentStepIndex = this._getStepIndex(this.currentStep)
				, nextStep = this.steps[currentStepIndex + 1]
				, nextStepIndex = this._getStepIndex(nextStep);
			if(nextStepIndex > -1) {
				var nextStep = this.steps[currentStepIndex + 1];
				this.goToStep(nextStep.title);
			} else {
				console.log('No more steps in tutorial');
			}
		},

		nextTip : function () {
			var currentTipIndex = this._getTipIndex(this.currentTip)
				, nextTip = this.currentStep.tips[currentTipIndex + 1]
				, nextTipIndex = this._getTipIndex(nextTip);
			if(currentTipIndex > -1) {
				this.tooltip(this.currentTip.element, this.currentTip.message, this.currentTip.title);
			} else {
				this.nextStep();
			}
			
			this.currentTip = nextTip;
		}
	});
})(jQuery);
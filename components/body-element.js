import {LitElement, html, css} from 'lit';
import {CountElement} from './count-element/count-element.js';
import {ElectElement} from './elect-element/elect-element.js';
import {SearchElement} from './search-element/search-element.js';
import {FilterElement} from './filter-element/filter-element.js';
import {OptionElement} from './option-element/option-element.js';


export class BodyElement extends LitElement {
	static properties = {
		data: { type: Array },
		
		electData: { type: Array },

		checked: { type: Object },

		searchValue: { type: String },
		searchData: { type: Array },
		selectedData: { type: Array },
		optionsData: { type: Array }
	}

	constructor() {
		super();
		this.data = [];

		this.electData = [];

		this.checked = {};

		this.searchValue = '';
		this.searchData = [];
		this.selectedData = [];
		this.optionsData = [];

		// linked to search-element
		this.addEventListener('search-input', (event) => {
			this.searchValue = event.detail.input;

			this.searchData = [];
			this.optionsData.map((word) => {
				if (word.name.includes(this.searchValue)) {
					if(!this.searchData.includes(word)) {
						this.searchData.push(word);
					}
				};
			});
		});
		
		// linked to elect-element
		this.addEventListener('click-subtract', (event) => {
			const name = event.detail.target;
			let clickedElement = this.selectedData.filter((object) => object.name === name); // (1) [{...}]

			clickedElement[0].count--;

			if (clickedElement[0].count <= 0) {
				if (this.selectedData.includes(clickedElement[0])) {
					this.selectedData = this.selectedData.filter((object) => object.name !== clickedElement[0].name);
				};
			};
		});

		// linked to options-element
		this.addEventListener('click-add', (event) => {
			const name = event.detail.target;
			this.electData = this.data.filter((object) => object.name === name); // (1) [{...}]

			this.electData[0].count++;
		});

		// linked to filter-element
		this.addEventListener('filter-event', (event) => {
			const category = event.detail.filter.name; // 'vegetable'
			const selected = event.detail.filter.checked; // true

			this.checked[category] = selected; // { vegetable: true, dairy: false }

			console.log(this.checked);
			// this.filtered();
		});
	}

	async filtered() {
		/* 
		need to compare, this.checked
		(1) [{veg: true}]

		with this.searchData
		(1) [{src..., group..., name..., count...}]
		*/

		this.filteredData = this.data.filter(item => this.checked[item['group']]);

		const options = {
			detail: {
				filteredData: this.filteredData,
			},
			bubbles: true,
			composed: true
		};

    await this.updateComplete;
		this.dispatchEvent(new CustomEvent('filter-data', options));
	}

	static styles = css`
	  :host {
	  	display: flex;
	  	align-content: center;
	  	justify-content: center;
	  	flex-direction: column;
	  }
	`;

	generateOptions() {
		// setup the values necessary for OptionElement
		this.data.forEach( (object) => {
			let item = {};

			item.src = object.src;
			item.group = object.group;
			item.name = object.name;
			item.count = object.count;

			this.optionsData.push(item);
		});
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('data')) {
			if (!this.data.length) {
				return;
			};

			this.generateOptions();
			this.searchData = this.optionsData;
			console.log(this.searchData);
		};
	}

	render() {
		return html`
		<count-element .totals=${this.selectedData}></count-element>

		<elect-element .electData=${this.electData} .selectedData=${this.selectedData}></elect-element>

		<search-element></search-element>

		<filter-element .filterData=${this.optionsData}></filter-element>

		<option-element .searchData=${this.searchData} ></option-element>
		`;
	}
}

customElements.define('body-element', BodyElement);
import {LitElement, html, css} from 'lit';
import {AggregateElement} from './aggregate/aggregate-element.js';
import {ListElement} from './list/list-element.js';
import {SearchElement} from './search/search-element.js';
import {FilterElement} from './filter/filter-element.js';
import {GridElement} from './grid/grid-element.js';


export class CoreElement extends LitElement {
	static styles = css`
	  :host {
	  	display: flex;
	  	align-content: center;
	  	justify-content: center;
	  	flex-direction: column;
	  }
	`;

	static properties = {
		data: { type: Array },
		filtered: { type: Array },
		copyElements: { type: Array },
		searchValue: { type: String },
		searchData: { type: Array }
	}

	constructor() {
		super();
		this.data = [];

		// 'filter-event' event properties
		this.filtered = [];

		// 'click-subtract' event properties
		this.copyElements = [];

		// 'search-input' event properties
		this.searchValue = '';
		this.searchData = [];

		// listening to SearchElement
		this.addEventListener('search-input', (event) => {
			this.searchValue = event.detail.input;

			this.searchData = [];
			this.data.map((word) => {
				if (word.name.includes(this.searchValue)) {
					if(!this.searchData.includes(word)) {
						this.searchData.push(word);
					}
				};
			});
		});
		
		// listening to ItemElement
		this.addEventListener('click-subtract', (event) => {
			const name = event.detail.name; // 'banana'

			for (let value of this.data) {
				if (value.name === name) {
					value.count--;
					if (value.count <= 0){
						value.count = 0;
					}
					// trigger render by reassigning Object in memory
					value = Object.assign({}, value);
				}
				this.copyElements[value.name] = value;
			}
			this.data = Object.values(this.copyElements);
		});

		// listening to FoodButtonElement
		this.addEventListener('click-add', (event) => {
			const name = event.detail.name; // 'banana'

			for (let value of this.data) {
				if (value.name === name) {
					value.count++;
					// trigger render by reassigning Object in memory
					value = Object.assign({}, value);
				}
				this.copyElements[value.name] = value;
			}
			this.data = Object.values(this.copyElements);
		});

		// listening to FilterByElement
		this.addEventListener('filter-event', (event) => {
			const group = event.detail.filter.group; // 'fruit'
			const checked = event.detail.filter.checked // true

			for (let value of this.data) {
				if (value.group === group) {
					value.checked = checked;
					value = Object.assign({}, value);
				}
				this.filtered[value.group] = value; 
			}
			this.data = Object.values(this.filtered);
		});
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('data')) {
			if (!this.data.length) {
				return;
			};
		};
	}

	render() {
		return html`
			<aggregate-element .data=${this.data}></aggregate-element>
			<list-element .data=${this.data}></list-element>
			<search-element></search-element>
			<filter-element .data=${this.data}></filter-element>
			<grid-element .data=${this.data} .searchData=${this.searchData} ></grid-element>
		`;
	}
}

customElements.define('core-element', CoreElement);
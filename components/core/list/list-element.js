import {LitElement, html, css} from 'lit';
import {ItemElement} from './item/item-element.js';
import {AddBtnElement} from './add-btn/add-btn-element.js';

export class ListElement extends LitElement {
	static styles = css`
		* {
			padding: 0;
			margin: 0;
			border-sizing: border-box;
		}

		.item {
			font-family: Trebuchet MS;
			border-top: 1px solid black;
		 	border-bottom: 1px solid black;
			height: 340px;
			overflow: auto;
			background-color: #FAF9F6;
		}

		.button {
			display: flex;
			align-content: center;
			justify-content: center;
			height: 32px;
		}

		.add {
			width: 30px;
			height: 30px;
		}

		button {
			cursor: pointer;
			text-transform: uppercase;
			font-family: Trebuchet MS;
			font-weight: 700;
			letter-spacing: 1px;
			width: 100%;
			height: 100%;
			margin: 5px;
			border-radius: 10px;
			background:	rgba(150, 206, 180, 0.8);
			transition-duration: 300ms;
		}

		button:active {
			filter: brightness(140%);
		}
	`;

	static properties = {
		data: { type: Array },
		_valueReset: { type: Array }
	}

	constructor() {
		super();
		this.data = [];
		this._valueReset = [];
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('data')) {
			if (!this.data.length) {
				return;
			}
		};
	}

	async handleClick() {
		const options = {
			bubbles: true,
			composed: true
		};
		await this.updateComplete;
		this.dispatchEvent(new CustomEvent('clear-count', options));
	}

	render() {
		return html`
		<div class="item">
		${this.data.map(
			(value) => {
				if (value.count <= 0) {
					return;
				}
				return html`
					<add-btn-element name=${value.name}></add-btn-element>
					<item-element .value=${value}></item-element>
				`
			})
		}
		</div>
		<div class="button">
			<button @click=${this.handleClick}>Clear all</button>
		</div>
		`;
	}
}

customElements.define('list-element', ListElement);
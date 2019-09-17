import Dropdown from '@kintone/kintone-ui-component/esm/js/Dropdown'

type Item = {
    value: string;
    label?: string;
    isDisabled?: boolean;
}

type SelectInputProp = {
    title: string,
    value?: string,
    items: Array<Item>
}

export class SelectInput {
    private el!: Dropdown;
    protected _props: SelectInputProp = {
        title: '',
        value: '',
        items: []
    }

    constructor(params: SelectInputProp) {
        if (params) {
            this._props = {...this._props, ...params};
        }
        this.el = new Dropdown({items: this._props.items, value: this._props.items[0].value})
    }

    createContainer() {
        const container = document.createElement('div')

        const label = document.createElement('h3')
        label.textContent = this._props.title

        container.appendChild(label)
        container.appendChild(this.el.render())
        return container
    }

    getValue() {
       return this.el.getValue()
    }
    render() {
        return this.createContainer()
    }
}
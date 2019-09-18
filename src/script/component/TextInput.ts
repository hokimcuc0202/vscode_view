
import Text from '@kintone/kintone-ui-component/esm/js/Text'

type TextInputProp = {
    title: string,
    value?: string
}
export class TextInput {
    private el!: Text;
    // private label!: HTMLDivElement;
    protected _props: TextInputProp = {
        title: '',
        value: ''
    }

    constructor(params: TextInputProp) {
        this.el = new Text({value: this._props.value})
        if (params) {
            this._props = {...this._props, ...params};
        }
    }

    getValue() {
        return this.el.getValue()
    }

    createContainer() {
        const container = document.createElement('div')

        const label = document.createElement('h3')
        label.textContent = this._props.title

        container.appendChild(label)
        container.appendChild(this.el.render())
        return container
    }
    render() {
        return this.createContainer()
    }
}
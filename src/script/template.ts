import {SelectInput} from './component/SelectInput'
import {TextInput} from './component/TextInput'
import Button from '@kintone/kintone-ui-component/esm/js/Button'
import * as vscode from 'vscode'

declare var acquireVsCodeApi: Function

class RenderTemplate {
    private appNameEl: TextInput
    private typeEl: SelectInput
    private appIdEl: TextInput
    domainEl: TextInput
    userNameEl: TextInput
    passwordEl: TextInput
    reactEl: SelectInput
    proxyEl: TextInput
    typescriptEl: SelectInput
    webpackEl: SelectInput
    entryWebpackEl: TextInput
    eslintEl: SelectInput
    scopeEl: SelectInput
    submitBtn: Button
    vscode: any;

    constructor() {
        this.appNameEl = new TextInput({title: 'App Name'})
        this.typeEl = new SelectInput({title: 'Project Type', items:[{value: 'Customization', label: 'Customization'},{value: 'Plugin', label: 'Plugin'}]})
        this.domainEl = new TextInput({title: 'Kintone domain'})
        this.appIdEl = new TextInput({title: 'Kintone appID'})
        this.userNameEl = new TextInput({title: 'UserName'})
        this.passwordEl = new TextInput({title: 'Password'})
        this.proxyEl = new TextInput({title: 'Proxy'})
        this.reactEl = new SelectInput({title: 'Use React', items:[{value: 'yes', label: 'Yes'},{value: 'no', label: 'No'}]})
        this.typescriptEl = new SelectInput({title: 'Use TypeScript', items:[{value: 'yes', label: 'Yes'},{value: 'no', label: 'No'}]})
        this.webpackEl = new SelectInput({title: 'Use webpack', items:[{value: 'yes', label: 'Yes'},{value: 'no', label: 'No'}]})
        this.entryWebpackEl = new TextInput({title: 'File entry for webpack', value: 'index.ts'})
        this.eslintEl = new SelectInput({title: 'Use @cybozu/eslint-config', items:[{value: 'yes', label: 'Yes'},{value: 'no', label: 'No'}]})
        this.scopeEl = new SelectInput({title: 'Customization scope', items:[{value: 'All', label: 'All'},{value: 'ADMIN', label: 'ADMIN'},{value: 'NONE', label: 'NONE'}]})
        this.submitBtn = new Button({text: 'Add Template', type: 'submit'})
        

        this.vscode = acquireVsCodeApi();
        this.handleSubmitBtn()
    }

    createContainerEl() {
        const container = document.createElement('div')
        container.appendChild(this.appNameEl.render())
        container.appendChild(this.typeEl.render())
        container.appendChild(this.domainEl.render())
        container.appendChild(this.appIdEl.render())
        container.appendChild(this.userNameEl.render())
        container.appendChild(this.passwordEl.render())
        container.appendChild(this.proxyEl.render())
        container.appendChild(this.reactEl.render())
        container.appendChild(this.typescriptEl.render())
        container.appendChild(this.webpackEl.render())
        container.appendChild(this.entryWebpackEl.render())
        container.appendChild(this.eslintEl.render())
        container.appendChild(this.scopeEl.render())
        container.appendChild(this.submitBtn.render())
        return container
    }

    handleSubmitBtn() {
        this.submitBtn.on('click', () => {
            let textCommand = `kintone-cli create-template --app-name ${this.appNameEl.getValue()} `
            textCommand += `--type ${this.typeEl.getValue()} `
            textCommand += `--set-auth --domain ${this.domainEl.getValue()} --username ${this.userNameEl.getValue()} --password ${this.passwordEl.getValue()} `

            if (this.proxyEl.getValue() !== '') {
                textCommand += `--proxy ${this.proxyEl.getValue()} `
            } else {
                textCommand += `--no-proxy `
            }

            if (this.typeEl.getValue() === 'Customization') {
                textCommand += `--app-id ${this.appIdEl.getValue()} `
            }

            if (this.reactEl.getValue() === 'yes') {
                textCommand += `--use-react `
            }

            if (this.typescriptEl.getValue() === 'yes') {
                textCommand += `--use-typescript `
            }

            if (this.webpackEl.getValue() === 'yes') {
                textCommand += `--use-webpack --entry ${this.entryWebpackEl.getValue()} `
            }

            if (this.eslintEl.getValue() === 'yes') {
                textCommand += `--use-cybozu-lint `
            }

            this.vscode.postMessage({
                command: 'createTemplate',
                text: textCommand,
            });
        })
    }

    render() {
        return this.createContainerEl()
    }
}

const renderTemplate = () => {
    const template = new RenderTemplate()
    const container = document.getElementById('container')
    if (container) {
        container.appendChild(template.render())
    }
}
renderTemplate()
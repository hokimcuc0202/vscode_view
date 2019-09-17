/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { QuickPickItem, window, Disposable, CancellationToken, QuickInputButton, QuickInput, ExtensionContext, QuickInputButtons, Uri } from 'vscode';

/**
 * A multi-step input using window.createQuickPick() and window.createInputBox().
 * 
 * This first part uses the helper class `MultiStepInput` that wraps the API for the multi-step case.
 */
export async function createTemplateStepInput(context: ExtensionContext) {

	class MyButton implements QuickInputButton {
		constructor(public iconPath: { light: Uri; dark: Uri; }, public tooltip: string) { }
	}

	const title = 'Create Template';

	const types: QuickPickItem[] = ['Customization', 'Plugin']
		.map(label => ({ label }));


	interface State {
		domain: string,
		username:string,
		password: string,
		appName:string,
		appID:string,
		type: string,
		title: string;
		step: number;
		totalSteps: number;
		resourceGroup: QuickPickItem | string;
		name: string;
		runtime: QuickPickItem;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => pickTypeOfTemplate(input, state));
		return state as State;
	}

	

	async function pickTypeOfTemplate(input: MultiStepInput, state: Partial<State>) {
		const pick = await input.showQuickPick({
			title,
			step: 1,
			totalSteps: 3,
			placeholder: 'What type of app you want to create',
			items: types,
			activeItem: types[0],
			shouldResume: shouldResume
		});
		state.type = pick.label;
		return (input: MultiStepInput) => inputDomain(input, state);
	}

	async function pickUserName(input: MultiStepInput, state: Partial<State>) {
		const pick = await input.showQuickPick({
			title,
			step: 1,
			totalSteps: 3,
			placeholder: 'What type of app you want to create',
			items: types,
			activeItem: types[0],
			shouldResume: shouldResume
		});
		state.username = pick.label;
		return (input: MultiStepInput) => inputDomain(input, state);
	}

	async function inputResourceGroupName(input: MultiStepInput, state: Partial<State>) {
		state.resourceGroup = await input.showInputBox({
			title,
			step: 2,
			totalSteps: 4,
			value: typeof state.resourceGroup === 'string' ? state.resourceGroup : '',
			prompt: 'Choose a unique name for the resource group',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputDomain(input, state);
	}

	async function inputDomain(input: MultiStepInput, state: Partial<State>) {
		const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.domain = await input.showInputBox({
			title,
			step: 2 + additionalSteps,
			totalSteps: 7 + additionalSteps,
			value: state.name || '',
			prompt: 'What is your kintone domain',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputUserName(input, state);
	}

	async function inputUserName(input: MultiStepInput, state: Partial<State>) {
		const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.username = await input.showInputBox({
			title,
			step: 7 + additionalSteps,
			totalSteps: 7 + additionalSteps,
			value: state.name || '',
			prompt: 'What is your user name',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputPassword(input, state);
	}

	async function inputPassword(input: MultiStepInput, state: Partial<State>) {
		const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.password = await input.showInputBox({
			title,
			step: 4 + additionalSteps,
			totalSteps: 7 + additionalSteps,
			value: state.name || '',
			prompt: 'What is your password',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputAppName(input, state);
	}
	async function inputAppName(input: MultiStepInput, state: Partial<State>) {
		const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.appName = await input.showInputBox({
			title,
			step: 4 + additionalSteps,
			totalSteps: 7 + additionalSteps,
			value: state.name || '',
			prompt: 'What is your app name',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => inputAppID(input, state);
	}
	async function inputAppID(input: MultiStepInput, state: Partial<State>) {
		const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		// TODO: Remember current value when navigating back.
		state.appID = await input.showInputBox({
			title,
			step: 4 + additionalSteps,
			totalSteps: 7 + additionalSteps,
			value: state.name || '',
			prompt: 'What is your password',
			validate: validateNameIsUnique,
			shouldResume: shouldResume
		});
		return (input: MultiStepInput) => pickRuntime(input, state);
	}

	async function pickRuntime(input: MultiStepInput, state: Partial<State>) {
		const additionalSteps = typeof state.resourceGroup === 'string' ? 1 : 0;
		const runtimes = await getSelectOption(state.resourceGroup!, undefined /* TODO: token */);
		// TODO: Remember currently active item when navigating back.
		state.runtime = await input.showQuickPick({
			title,
			step: 7 + additionalSteps,
			totalSteps: 7 + additionalSteps,
			placeholder: 'Pick a runtime',
			items: runtimes,
			activeItem: state.runtime,
			shouldResume: shouldResume
		});
	}

	function shouldResume() {
		// Could show a notification with the option to resume.
		return new Promise<boolean>((resolve, reject) => {

		});
	}

	async function validateNameIsUnique(name: string) {
		// ...validate...
		await new Promise(resolve => setTimeout(resolve, 1000));
		return name === 'vscode' ? 'Name not unique' : undefined;
	}

	async function getSelectOption(resourceGroup: QuickPickItem | string, token?: CancellationToken): Promise<QuickPickItem[]> {
		// ...retrieve...
		await new Promise(resolve => setTimeout(resolve, 1000));
		return ['Node 8.9', 'Node 6.11', 'Node 4.5']
			.map(label => ({ label }));
	}

	const state = await collectInputs();
	return state;
	// window.showInformationMessage(`Creating Application Service '${state.name}'`);
}


// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------


class InputFlowAction {
	private constructor() { }
	static back = new InputFlowAction();
	static cancel = new InputFlowAction();
	static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
	title: string;
	step: number;
	totalSteps: number;
	items: T[];
	activeItem?: T;
	placeholder: string;
	buttons?: QuickInputButton[];
	shouldResume: () => Thenable<boolean>;
}

interface InputBoxParameters {
	title: string;
	step: number;
	totalSteps: number;
	value: string;
	prompt: string;
	validate: (value: string) => Promise<string | undefined>;
	buttons?: QuickInputButton[];
	shouldResume: () => Thenable<boolean>;
}

class MultiStepInput {

	static async run<T>(start: InputStep) {
		const input = new MultiStepInput();
		return input.stepThrough(start);
	}

	private current?: QuickInput;
	private steps: InputStep[] = [];

	private async stepThrough<T>(start: InputStep) {
		let step: InputStep | void = start;
		while (step) {
			this.steps.push(step);
			if (this.current) {
				this.current.enabled = false;
				this.current.busy = true;
			}
			try {
				step = await step(this);
			} catch (err) {
				if (err === InputFlowAction.back) {
					this.steps.pop();
					step = this.steps.pop();
				} else if (err === InputFlowAction.resume) {
					step = this.steps.pop();
				} else if (err === InputFlowAction.cancel) {
					step = undefined;
				} else {
					throw err;
				}
			}
		}
		if (this.current) {
			this.current.dispose();
		}
	}

	async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder, buttons, shouldResume }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items;
				if (activeItem) {
					input.activeItems = [activeItem];
				}
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
					...(buttons || [])
				];
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidChangeSelection(items => resolve(items[0])),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}

	async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate, buttons, shouldResume }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createInputBox();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.value = value || '';
				input.prompt = prompt;
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
					...(buttons || [])
				];
				let validating = validate('');
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidAccept(async () => {
						const value = input.value;
						input.enabled = false;
						input.busy = true;
						if (!(await validate(value))) {
							resolve(value);
						}
						input.enabled = true;
						input.busy = false;
					}),
					input.onDidChangeValue(async text => {
						const current = validate(text);
						validating = current;
						const validationMessage = await current;
						if (current === validating) {
							input.validationMessage = validationMessage;
						}
					}),
					input.onDidHide(() => {
						(async () => {
							reject(shouldResume && await shouldResume() ? InputFlowAction.resume : InputFlowAction.cancel);
						})()
							.catch(reject);
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}
}

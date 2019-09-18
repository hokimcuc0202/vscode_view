import * as vscode from 'vscode';
import * as cmd from 'child_process';
import * as path from 'path';
import {ProjectView} from './cliProjectView';
import { createTemplateStepInput } from './templateStepInput';
import { TemplatePanel } from './TemplatePanel';

export async function activate(context: vscode.ExtensionContext) {
	const nodeDependenciesProvider = new ProjectView(vscode.workspace.rootPath || '');
	
	vscode.window.onDidCloseTerminal(() => {
		nodeDependenciesProvider.refresh()
	}); 
	// vscode.window.onDidChangeActiveTerminal
	vscode.window.onDidChangeActiveTerminal(e => {
		console.log(`Active terminal changed, name=${e ? e.name : 'undefined'}`);
	});

	vscode.window.registerTreeDataProvider('kintoneProject', nodeDependenciesProvider);
	
	vscode.commands.registerCommand('kintoneProject.addProject', async () =>{
		const projectName = await vscode.window.showInputBox({placeHolder:'project name', prompt:"project name"}) || '';
		let rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath || '';
		const command = `kintone-cli init --quick --project-name ${projectName}`;
		const terminal = vscode.window.createTerminal({
			name: `Create project`,
			cwd: rootPath
		});
		terminal.sendText(command);
		terminal.show();
		(<any>terminal).onDidWriteData((data: String) => {
			console.log('Project created!', typeof data, data === 'Project created!');
			
			if (data.indexOf('Project created!') > -1) {
				console.log("Terminal data: ", data);
				nodeDependenciesProvider.refresh()
			}
		});
	});

	vscode.commands.registerCommand('kintoneProject.deployTemplate', (node: any) => {
		const command = `kintone-cli deploy --app-name ${node.label}`
		const terminal = vscode.window.createTerminal({
			name: `Deploy project`,
			cwd: node.path
		});
		terminal.sendText(command);
		terminal.show();
	});
	
	vscode.commands.registerCommand('kintoneProject.addTemplate', async (node: any) => {
		// const templateName = await vscode.window.showInputBox({placeHolder:'Template name', prompt:"Template name"})
		// const typeOfTemplate = await vscode.window.showInputBox({placeHolder:'Type of template', prompt:"type of  template", valueSelection:[1,2]})

		// let inputs = await createTemplateStepInput(context)

		// let command = `kintone-cli create-template --quick --set-auth --domain ${inputs.domain} `
		// command += `--username ${inputs.username} --password ${inputs.password} --app-id ${inputs.appID} --type ${inputs.type}`
		// console.log(node.path);
		
		// const terminal = vscode.window.createTerminal({
		// 	name: `Deploy project`,
		// 	cwd: node.path + `/${node.label}`
		// });
		// terminal.sendText(command);
		// terminal.show();
		
		TemplatePanel.createOrShow(context.extensionPath, path.join(node.path, node.label), nodeDependenciesProvider);
	});

	vscode.commands.registerCommand('kintoneProject.devTemplate', (node: any) => {
		const command = `kintone-cli dev --app-name ${node.label} --watch`
		const terminal = vscode.window.createTerminal({
			name: `Dev ${node.label}`,
			cwd: node.path
		});
		terminal.sendText(command);
		terminal.show();
	});
}

export function deactivate() {}

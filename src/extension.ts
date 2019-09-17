import * as vscode from 'vscode';
import * as cmd from 'child_process';
import * as path from 'path';
import {ProjectView} from './cliProjectView';
import { createTemplateStepInput } from './templateStepInput';
import { TemplatePanel } from './TemplatePanel';

export function activate(context: vscode.ExtensionContext) {
	const nodeDependenciesProvider = new ProjectView(vscode.workspace.rootPath || '');
	vscode.window.registerTreeDataProvider('kintoneProject', nodeDependenciesProvider);
	vscode.commands.registerCommand('kintoneProject.addProject', async () =>{
		const projectName = await vscode.window.showInputBox({placeHolder:'project name', prompt:"project name"}) || '';
		let rootPath = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0].uri.fsPath || '';
		const command = 'kintone-cli';
		
		// const exec = cmd.exec(command, {cwd: rootPath}, (err, stdout, stderr) => {
		// 	if (err) {
		// 		vscode.window.showErrorMessage(err.toString().replace(command,''));
		// 	}
		// });
		// cmd.spawnSync('node', ['--version'], {stdio: 'inherit'});
		 cmd.spawn(command, ['init', '--install', '--quick', '--project-name', projectName], { cwd: rootPath, stdio: 'inherit'})
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
		

		TemplatePanel.createOrShow(context.extensionPath, path.join(node.path, node.label));
	});
}

export function deactivate() {}

import * as vscode from 'vscode';

import * as fs from'fs';
import * as path from 'path';

export class ProjectView implements vscode.TreeDataProvider<Dependency> {
	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> = new vscode.EventEmitter<Dependency | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string) {
	}
	
	refresh(): void {
		this._onDidChangeTreeData.fire();
	}
    
    getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		if (!this.workspaceRoot) {
			vscode.window.showInformationMessage('Invalid workspace');
			return Promise.resolve([]);
        }
        
		if (element) {
			return Promise.resolve(this.getProjectList(path.join(this.workspaceRoot, element.label) , false));
		} else {
            const projectList = this.getProjectList(this.workspaceRoot, true);
            return Promise.resolve(projectList)
		}

    }
    
    getProjectList(root: string, isCollapsed: boolean) {
        return fs.readdirSync(root, { withFileTypes: true })
            .filter(dirent =>
                {
                  let condition = dirent.isDirectory()
                  if (!isCollapsed ) {
                    condition = this.pathExists(path.join(root, dirent.name, 'config.json'))
                  }
                  return condition
                }
                 
                 )
            .map(dirent => { 
                let collapsed = vscode.TreeItemCollapsibleState.None;
                let context = 'template'
                if (isCollapsed) {
                    collapsed = vscode.TreeItemCollapsibleState.Collapsed;
                    context = 'project'
                }

                return new Dependency(dirent.name,collapsed, context,root)})
    }

    pathExists(p: string): boolean {
		try {
			fs.accessSync(p);
		} catch (err) {
			return false;
		}
		return true;
	}
}

export class Dependency extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly contextValue?: string,
		public readonly path?: string
	) {
        
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label}`;
	}

}
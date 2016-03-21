// SKYLIFT CONCEPT CODE
// COPYRIGHT (C) 2016 NEVADA_SCOUT [http://hvy.io/skylift]

'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    var phpunitPath: {};
    var skyliftSettings: {}
    var enabled = true;

    // Handle Initialisation
    doInit();

    // Register command handlers
    let initSkylift = vscode.commands.registerCommand('extension.initSkylift', () => {});

    let reloadConfigCommand = vscode.commands.registerCommand('extension.reloadConfig', () => {
        loadConfig()
        vscode.window.showInformationMessage('[SKYLIFT] Global + local config reloaded');
    });

    let showFailingTestsCommand = vscode.commands.registerCommand('extension.showFailingTests', () => {
        // TODO
    });

    let runTestsManuallyCommand = vscode.commands.registerCommand('extension.runAllTestsNow', () => {
        // TODO
    });

    let pauseExecutionCommand = vscode.commands.registerCommand('extension.pauseExecution', () => {
        enabled = false;
        vscode.window.showInformationMessage('[SKYLIFT] Automatic text execution paused');
    });

    let startExecutionCommand = vscode.commands.registerCommand('extension.startExecution', () => {
        enabled = true;
        vscode.window.showInformationMessage('[SKYLIFT] Automatic text execution resumed');
    });

    context.subscriptions.push(initSkylift);
    context.subscriptions.push(showFailingTestsCommand);
    context.subscriptions.push(runTestsManuallyCommand);
    context.subscriptions.push(pauseExecutionCommand);
    context.subscriptions.push(startExecutionCommand);


    function loadConfig() {
        // Global
        phpunitPath = vscode.workspace.getConfiguration("skylift").get("phpunitPath");

        // Local
        skyliftSettings = { projectConfigExists: false };
    }
    
    function doInit()
    {
        loadConfig();

        let uiTester = new SkyliftUi;
        //uiTester.showIdle(182);
        uiTester.showFail(5);
        //uiTester.showInProgress();

        // if (skyliftSettings.projectConfigExists)
        // {
        //     vscode.window.showInformationMessage('[SKYLIFT] Initialised! Loaded config from existing .skylift file');
        // }
        // else
        // {
        //     vscode.window.showInformationMessage('[SKYLIFT] Initialised! Existing .skylift file not found - new local config file created');
        // }
    }
}

// this method is called when your extension is deactivated
export function deactivate() {}

class SkyliftUi
{
    private _statusBarItem: vscode.StatusBarItem;

    public showIdle(testCount)
    {
        // Font: ✖ ✔
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
            this._statusBarItem.text = "✔";
            this._statusBarItem.tooltip = "Skylift: " + testCount + " tests passing, no failures"
            this._statusBarItem.show();
        }
    }

    public showFail(failingCount)
    {
        // Font: ✖ ✔
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
            this._statusBarItem.text = "✖ " + failingCount;
            this._statusBarItem.tooltip = "Skylift: " + failingCount + " failing tests"
            this._statusBarItem.show();
            // TODO -- Add command to display failing tests in top dropdown
            //this._statusBarItem.command = "";
        }
    }

    public showInProgress()
    {
        if (!this._statusBarItem) {
            this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
            var intervaId = this.doProgress();
            this._statusBarItem.tooltip = "Skylift: test run in progress"
            this._statusBarItem.show();
        }
    }

    private doProgress()
    {
        let progressSteps: string[] = [" ........", ". .......", ".. ......", "... .....", ".... ....", "..... ...", "...... ..", "....... .", "........ ",
                                       "........ ", "....... .", "...... ..", "..... ...", ".... ....", "... .....", ".. ......", ". ......."];
        let frame = 0;

        var intervalId = setInterval(() => {
            this._statusBarItem.text = progressSteps[frame];

            if (frame < progressSteps.length) {
                frame++;
            } else {
                frame = 0;

                // Prevent strange bug with text being removed
                this._statusBarItem.text = progressSteps[frame];

                // Stop timer running
                //clearInterval(intervalId);
            }
        }, 100);
        
        return intervalId;
    }
}



class CodeChangeHandler
{
    private skyliftTestRunner: SkylistTestRunner;
    
    constructor(skyliftTestRunner: SkylistTestRunner) {
        this.skyliftTestRunner = skyliftTestRunner;

        let subscriptions: vscode.Disposable[] = [];

        vscode.workspace.onDidChangeTextDocument(this.runTests, this, subscriptions);
    }
    
    private runTests() {
        this.skyliftTestRunner.runAffectedTestsWithPriority();
    }
}

class SkylistTestRunner
{
    private testClasses: TestClass[] = [];

    public buildTestClasses()
    {
        // TODO -- Find each file in the .skylift defined tests folder(s)
    }

    public runAllTestsl()
    {
        // TODO -- Run all test classes in parallel (load max threads from config)
    }

    public runAffectedTestsWithPriority()
    {
        // TODO -- Run all test classes in parallel (load max threads from config)
        //         Run the affected test class on the first thread
    }

    // Notes:
    // As each thread finishes, update the UI with each test class status
}

class TestClass
{
    public fileName: string;

    public className: string;

    public phpunitArg: string;

    public executionDone: boolean;

    // TODO -- Build folder structure for test param using tests folder defined in .skylift file
    //         and directory path from fileName
}

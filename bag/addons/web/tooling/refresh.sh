#!/bin/bash
community=$(cd -- "$(dirname "$0")" &> /dev/null && cd ../../.. && pwd)
tooling="$community/addons/web/tooling"
testRealPath="$(realpath --relative-to=. "$tooling/hooks")"
if [[ $testRealPath == "" ]]; then
    echo "Please install realpath"
    exit 1
fi

refreshInDir () {
    cd "$1" || exit
    cp "$tooling/_eslintignore" .eslintignore
    cp "$tooling/_eslintrc.json" .eslintrc.json
    cp "$tooling/_jsconfig.json" jsconfig.json
    cp "$tooling/_package.json" package.json
    cd - &> /dev/null
}

read -p "Refresh tooling in oy ? [y, n]" doOY
if [[ $doOY != "n" ]]; then
    read -p "What is the relative path from community to oy ? (../oy)" pathToOY
    pathToOY=${pathToOY:-../oy}
    pathToOY=$(realpath "$community/$pathToOY")
fi

refreshInDir "$community"

if [[ $doOY != "n" ]]
then
    refreshInDir "$pathToOY" copy
fi

echo ""
echo "The JS tooling config files have been refreshed"
echo "Make sure to refresh the eslint and typescript service and configure your IDE so it uses the config files"
echo 'For VSCode, look inside your .vscode/settings.json file ("editor.defaultFormatter": "dbaeumer.vscode-eslint")'
echo "If you still have issues, try doing a full reload instead which will reinstall the node modules"
echo ""

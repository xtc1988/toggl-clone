#!/bin/bash

# Vercelデプロイスクリプト
# プロジェクト名: dainage2

echo "=== Toggl Clone Vercelデプロイスクリプト ==="
echo "プロジェクト名: dainage2"
echo ""
echo "このスクリプトは以下の手順を実行します："
echo "1. Vercelにログイン"
echo "2. プロジェクトをデプロイ"
echo ""
echo "開始する前に、以下を確認してください："
echo "- Vercelアカウントを持っている"
echo "- ブラウザでログインできる"
echo ""
read -p "続行しますか？ (y/n): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo ""
    echo "=== ステップ1: Vercelログイン ==="
    npx vercel login
    
    echo ""
    echo "=== ステップ2: デプロイ ==="
    echo "以下の質問に対して、指定された回答を入力してください："
    echo ""
    echo "1. Set up and deploy? → y"
    echo "2. Which scope? → あなたのアカウントを選択"
    echo "3. Link to existing project? → n"
    echo "4. Project name? → dainage2"
    echo "5. In which directory? → ./ (Enterキー)"
    echo "6. Want to override settings? → n"
    echo ""
    
    npx vercel --name dainage2
fi
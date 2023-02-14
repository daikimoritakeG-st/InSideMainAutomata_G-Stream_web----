

# python環境構築

## VENVで仮想環境初期設定

```
python -m venv venv
```

<br>

## VENVをアクティブにするために、PowerShellを有効かする

PowerShell を開いて、下記のコマンドを実行する
```
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
```


## VENV をアクティブにする

プロジェクトのフォルダで下記を実行
```
.\venv\scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\activate
```
VENVの仮想環境に入れる


<br>
<br>

# 仮想環境のライブラリを管理

## インストールされたライブラリを確認

```
pip list
```

<br>


## ライブラリをインストール

```
pip install [ライブラリ名]
```
[ライブラリ名]　にインストールしたいライブラリ名を指定します


<br>
<br>

# node ライブラリ
* mariadb
* node-fetch --HTTPリクエスト
* request   --HTTPリクエスト
* playwright  --スクレイピング
npm i encoding-japanese


# 環境を移行する

## 移行元でライブラリ一覧を書き出す

```
pip freeze > requirements.txt
```

## 移行先でライブラリをインストールする

```
pip install -r requirements.txt
```



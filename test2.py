#ライブラリー
import pandas as pd
import selenium
from selenium import webdriver
from selenium.webdriver.support.select import Select
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
from datetime import datetime, date, timedelta
import os
import requests
import sys
import glob
import shutil
import zipfile
from pathlib import Path
import csv

parent = Path(__file__).resolve().parent  # ファイルのディレクトリを取得

#日付取得
date_today = datetime.today()
date_yesterday = date_today - timedelta(days=1)
date_weekday = date_yesterday.strftime('%a')
input_yesterday = date_yesterday.strftime('%Y-%m-%d')


cwday = input_yesterday.replace("-","/")

#年月取得
#年月取得
year = date_yesterday.strftime("%Y")
month = date_yesterday.strftime("%m").lstrip("0")
day = date_yesterday.strftime("%d").lstrip("0")
date_year = date_yesterday.year
date_month = date_yesterday.month
date_days = date_yesterday.day
date_month_chenge = str(date_month)
#シリアル値を作成(serial)
date_nonzero = input_yesterday
strpdate = datetime.strptime(date_nonzero, '%Y-%m-%d')-datetime(1899,12,31)
serial = strpdate.days + 1


#csvファイルの読み込み
csvfiles = glob.glob(r'C:\Users\info\Downloads\rpp_item_reports_hobinavi_*.csv')
# print(len(csvfiles))
# print(csvfiles)
csv_dates = []
col = []
with open(csvfiles[0], "r", encoding="cp932") as csv_file:
    f = csv.reader(csv_file, delimiter=",", doublequote=True, lineterminator="\r\n", quotechar='"', skipinitialspace=True)
    for ind, value in  enumerate(f):
        if ind == 6: # CSVのカラムの時の処理
            col = value # カラム名を指定
            colleng = len(col) # カラム数を取得
        if ind > 6:
            while len(value) > colleng: # カラム数よりデータが多い場合は、最後のデータを消去して数を合わせる
                print(value.pop(-1)) # 最後の表を消去し、取り出す
            csv_dates.append(value)

# print(csv_dates[0])
# p_csv = pd.read_csv(csvfiles[0], encoding="cp932")

'''
CSVのカラム名は、元データのものを使う
'''

# col = ["コントロールカラム","日付","商品ページURL","商品管理番号","入札単価","CTR(%)","商品CPC","クリック数(合計)",
#     "実績額(合計)","CPC実績(合計)","クリック数(新規)","実績額(新規)","CPC実績(新規)","クリック数(既存)","実績額(既存)",
#     "CPC実績(既存)","売上金額(合計12時間)","売上件数(合計12時間)","CVR(合計12時間)(%)","ROAS(合計12時間)(%)","注文獲得単価(合計12時間)",
#     "売上金額(合計720時間)","売上件数(合計720時間)","CVR(合計720時間)(%)","ROAS(合計720時間)(%)","注文獲得単価(合計720時間)",
#     "売上金額(新規12時間)","売上件数(新規12時間)","CVR(新規12時間)(%)","ROAS(新規12時間)(%)","文獲得単価(新規12時間)","売上金額(新規720時間)",
#     "売上件数(新規720時間)","CVR(新規720時間)(%)","ROAS(新規720時間)(%)","注文獲得単価(新規720時間)","売上金額(既存12時間)",
#     "売上件数(既存12時間)","CVR(既存12時間)(%)","ROAS(既存12時間)(%)","注文獲得単価(既存12時間)","売上金額(既存720時間)",
#     "売上件数(既存720時間)","CVR(既存720時間)(%)","ROAS(既存720時間)(%)","注文獲得単価(既存720時間)"]
# rppcsv = pd.read_csv(csvfiles[0], encoding="cp932", names=col)
print(len(col))
print(len(csv_dates[1]))
rppcsv = pd.DataFrame(csv_dates, columns=col)

print(rppcsv)

#不要な列と行を削除する
#rppcsv = rppcsv.drop(["CPC実績(合計)","クリック数(新規)","実績額(新規)","CPC実績(新規)","クリック数(既存)","実績額(既存)",
#       "CPC実績(既存)","売上金額(合計12時間)","売上件数(合計12時間)","CVR(合計12時間)(%)","ROAS(合計12時間)(%)","注文獲得単価(合計12時間)",
#       "売上金額(合計720時間)","売上件数(合計720時間)","CVR(合計720時間)(%)","ROAS(合計720時間)(%)","注文獲得単価(合計720時間)",
#       "売上金額(新規12時間)","売上件数(新規12時間)","CVR(新規12時間)(%)","ROAS(新規12時間)(%)","文獲得単価(新規12時間)","売上金額(新規720時間)",
#       "売上件数(新規720時間)","CVR(新規720時間)(%)","ROAS(新規720時間)(%)","注文獲得単価(新規720時間)","売上金額(既存12時間)",
#       "売上件数(既存12時間)","CVR(既存12時間)(%)","ROAS(既存12時間)(%)","注文獲得単価(既存12時間)","売上金額(既存720時間)",
#       "売上件数(既存720時間)","CVR(既存720時間)(%)","ROAS(既存720時間)(%)","注文獲得単価(既存720時間)"], axis=1)
# rppcsv = rppcsv.drop([0, 1, 2, 3, 4, 5])

#コントロールパネルに日付を入力
input_yesterday = input_yesterday.replace("-","/")
rppcsv["コントロールカラム"] = input_yesterday
rppcsv["商品CPC"] = "."
rppcsv.insert(0, "生成コード", str(serial)+rppcsv["商品管理番号"])
input_yesterday = input_yesterday.replace("/","")


rppcsv.to_csv("C:/Users/info/Downloads/"+input_yesterday+"_rpp.csv", encoding = "cp932", index = False, errors="ignore")
os.remove(csvfiles[0])


# In[62]:


#フォルダを作成
path = "//fileserver/share2/【仮】03.システム／物流/10.システム開発関連/楽天‗商品分析/RPP/"+input_yesterday
try:
    os.mkdir(path)
except:
    pass


# In[63]:


#フォルダを作成
path2 = "//fileserver/share2/【仮】04.EC/98.全サイトページ関係/95.アシロボ/太田さん依頼分/取得結果/楽天RMS広告CSV抽出分/商品別/"+year+"年"+month+"月"
try:
    os.mkdir(path2)
except:
    pass


# In[64]:


#ファイル名取得
csvfiles = glob.glob(r'C:\Users\info\Downloads\*_rpp.csv')


# In[65]:


#遷移フォルダへ移動
for file in csvfiles:
    filename = os.path.basename(file)
    if os.path.isfile(path2 + '/'+input_yesterday+'_rpp.csv'):
        # ファイルが存在する
        roomid = '251884445'
        messagesorce = path2 + '/'+input_yesterday+'_rpp.csv\nがすでに存在しているため、ダウンロードしたファイルを保存できませんでした。'

        print('ファイルがすでに存在しているため、ダウンロードしたファイルを保存できませんでした。')

    else:
        shutil.copy('C:/Users/info/Downloads/' + filename,path2 + '/'+input_yesterday+'_rpp.csv')


# In[66]:


#遷移フォルダへ移動
for file in csvfiles:
    filename = os.path.basename(file)
    
    if os.path.isfile(path + '/'+input_yesterday+'_rpp.csv'):
        # ファイルが存在する
        roomid = '251884445'
        messagesorce = path + '/'+input_yesterday+'_rpp.csv\nがすでに存在しているため、ダウンロードしたファイルを保存できませんでした。'
 
        print('ファイルがすでに存在しているため、ダウンロードしたファイルを保存できませんでした。')

    else:
        shutil.move('C:/Users/info/Downloads/' + filename,path + '/'+input_yesterday+'_rpp.csv')


# In[67]:


#chatworkのルームIDとメッセージを設定し発信
roomid = '251884445'
messagesorce = '[toall]'+cwday+'のRMSのRPPレポートの取得が完了しました。'


# In[ ]:

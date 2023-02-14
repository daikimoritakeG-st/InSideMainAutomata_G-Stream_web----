#!/usr/bin/env python
# coding: utf-8

# In[72]:


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
import re
from pathlib import Path

    
parent = Path(__file__).resolve().parent # ファイルのディレクトリを取得


# In[73]:


#日付取得
date_today = datetime.today()
date_yesterday = date_today - timedelta(days=1)
input_today = date_today.strftime("%Y%m%d")
input_yesterday = date_yesterday.strftime("%Y%m%d")


# In[74]:


#Chatwork発信
def Chatwork(room,messagesorce):
    ENDPOINT = 'https://api.chatwork.com/v2'
    roomid = room
    message = messagesorce
    apikey = '4ca182854b8da03e4bb36d3031933b68'
    post_message_url = '{}/rooms/{}/messages'.format(ENDPOINT,roomid)
    headers = {'X-ChatworkToken' : apikey}
    params = {'body' : message}
    requests.post(post_message_url,headers=headers,params=params)


# In[75]:


#csv用のカラム
itemcolumns=['JANコード', '在庫状況']
itemdata = []


# In[76]:


#ブラウザから開く
options = Options()
# options.add_argument('--headless')
chromedriver_path = Path(parent, './lib/chromedriver.exe') # chromeドライバのパス
browser = webdriver.Chrome(executable_path=chromedriver_path, chrome_options=options)
browser.get('https://ganguoroshi.jp/item_list.html?siborikomi_clear=1&keyword=&x=19&y=18')
browser.maximize_window()


# In[77]:


#ログイン処理
browser.find_element_by_xpath('/html/body/div[1]/div/div/a[2]/img').click()
time.sleep(2)
#LoginID
email_elem = browser.find_element_by_name('LOGINID')
email_elem.send_keys('7554713')
#Password
password_elem = browser.find_element_by_name('PASSWORD')
password_elem.send_keys('hobi4311')
next_elem = browser.find_element_by_xpath('/html/body/div[3]/div/form/div/input')
next_elem.click()
time.sleep(2)


# In[78]:


#表示数を100にする
dropdown = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/div[1]/div[3]/select')
select = Select(dropdown)
select.select_by_value('100')


# In[66]:

#前頁ループ
for i in range(2):
    #1ページ50商品分ループ
    itemname = browser.find_elements_by_class_name('itemname')
    for j in range(100):
        try:
            if itemname[j].text.count("メーカー取寄") > 0:
                    jan = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/form/div/div['+str(j+1)+']/div[2]/h3').text
                    if jan == '194735005185' or jan == '0194735005185':
                        print('チェック')
                        print(type(jan))
                        print(jan)
                    itemdata.append([jan,"品切"])
                    continue
        except:
            pass
        try:
            #品切れ、残り僅かのxpathを探してsrcのurlを取得
            item = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/form/div/div['+str(j+1)+']/div[1]/div/img').get_attribute("src")
            #soldoutの文字列があればjanコードを取得しリストに追加
            if item.count("soldout") > 0:
                jan = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/form/div/div['+str(j+1)+']/div[2]/h3').text
                itemdata.append([jan,"品切"])
                if jan == '194735005185' or jan == '0194735005185':
                    print('チェック')
                    print(type(jan))
                    print(jan)
            else:
                jan = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/form/div/div['+str(j+1)+']/div[2]/h3').text
                itemdata.append([jan,"在庫有"])
                if jan == '194735005185' or jan == '0194735005185':
                    print('チェック')
                    print(type(jan))
                    print(jan)
        except:
            try:
                jan = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/form/div/div['+str(j+1)+']/div[2]/h3').text
                itemdata.append([jan,"在庫有"])
                if jan == '194735005185' or jan == '0194735005185':
                    print('チェック')
                    print(type(jan))
                    print(jan)
            except:
                break
    
    #次ページを表示するボタンのxpathが表示されているページ数によって場所が変化するためそれに対応する全部のxpathを確認し「次ページを表示」の文字列があればクリックする
    try:
        next1 = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/div[2]/div[4]/a[13]')
        if next1.text == "次ページを表示":
            next1.click()
            continue
        
        next2 = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/div[2]/div[4]/a[14]')
        if next2.text == "次ページを表示":
            next2.click()
            continue
    
        next3 = browser.find_element_by_xpath('/html/body/div[3]/div[2]/div[5]/div[2]/div[4]/a[15]')
        if next3.text == "次ページを表示":
            next3.click()
            continue
    except:
        break
browser.close()


# In[67]:

def lambfor(text):
    while len(text) < 13: # 13文字以下の時に0を先頭に追加
        text = '0' + text
    return text

for ind, value in enumerate(itemdata):
    itemdata[ind][0] = lambfor(value[0])

#データフレームにまとめる
itempagedata = pd.DataFrame(data=itemdata,columns=itemcolumns)


print(itempagedata['JANコード'].to_list())

# In[68]:


#前日のデータと比較して差分をcsvに追加する
#yeseterdayfile = pd.read_csv(r"//fileserver/share2/【仮】04.EC/98.全サイトページ関係/95.アシロボ/太田さん依頼分/依頼リスト/カワダオンライン/カワダオンライン品切れチェック_"+input_yesterday+".csv", 
#                    encoding = "cp932")
#yeseterdayfile["JANコード"] = yeseterdayfile["JANコード"].astype(str)
#itempagedata["JANコード"] = itempagedata["JANコード"].astype(str)
#mixdata = pd.concat([itempagedata, yeseterdayfile])

#mixdata = mixdata.drop_duplicates(subset=['JANコード'])
#print(mixdata)


# In[69]:


#前日のデータがある場合は、前日のデータと比較して差分をcsvに追加する
is_file_yeseter_loop = True
while is_file_yeseter_loop: # データがない場合は
    is_file_yeseterday = os.path.isfile(r"//fileserver/share2/【仮】04.EC/98.全サイトページ関係/95.アシロボ/太田さん依頼分/依頼リスト/カワダオンライン/カワダオンライン品切れチェック_"+input_yesterday+".csv")
    if is_file_yeseterday:
        # データがある場合は、ループを止める
        is_file_yeseter_loop = False;
    else:
        # データがない場合は、一つづつさかのぼる
        date_yesterday = date_yesterday - timedelta(days=1) # 一つ前の日付
        input_yesterday = date_yesterday.strftime("%Y%m%d") # 表記を修正

yeseterdayfile = pd.read_csv(r"//fileserver/share2/【仮】04.EC/98.全サイトページ関係/95.アシロボ/太田さん依頼分/依頼リスト/カワダオンライン/カワダオンライン品切れチェック_"+input_yesterday+".csv", 
                    encoding = "cp932")

yeseterdayfile["JANコード"] = yeseterdayfile["JANコード"].astype(str)
yeseterdayfile = yeseterdayfile.query('在庫状況 == "品切"')
for k in range(len(yeseterdayfile)): 
    serchcode = yeseterdayfile.iloc[k,0]
    ex = itempagedata.query('JANコード == @serchcode')
    if len(ex) == 0:
        # itempagedata = itempagedata.append({'JANコード': serchcode, '在庫状況': '品切'}, ignore_index=True) => バージョンに合わせて書き換え
        list = [[serchcode, '品切']]
        df_append = pd.DataFrame(data=list, columns=itemcolumns)
        itempagedata = pd.concat([itempagedata, df_append], ignore_index=True, axis=0)

# In[70]:

# print(itempagedata['JANコード'].to_list())
# datas = itempagedata['JANコード'].to_list()
# jans = []
# for data in datas:
#     if len(data) != 13:
#         jans.append(data)

# print(jans)

# In[71]:

# In[ ]:



# In[ ]:





# stgr-rs_status-view
## ソラニワRS_詳細ステータス表示スクリプト
ステータス詳細ページ（`http://st.x0.to/?mode=profile&eno=*&detail=*`）に各種補正を計算した詳細ステータスを書き込みます。  
書き込む場所はステータスとプロフィールの間です。

**使い方**  
ブックマークレット形式です。  
`javascript:(()=>fetch("https://raw.githubusercontent.com/htawa/stgr-rs_status-view/main/script/stgr-rs_status-view.min.js").then(a=>a.text()).then(a=>new Function(a)()))();`  
こちらをブックマークに登録して当該ページでお使いください。

当スクリプトの使用については自己責任でお願いします。

動作確認環境 google chrome pc版

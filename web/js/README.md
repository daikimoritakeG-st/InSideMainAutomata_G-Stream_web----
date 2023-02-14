
このフォルダは、JS用です。
main_node.jsのwebサーバからこのフォルダ以下のjsに全てアクセス可能です。
また、開発しやすくするため、下記のように相対パスで指定していても、正規表現で「js」というフォルダ名を検出して「web/js/～～」に変更します。

```html
<script src="../js/index.js"></script>
<script src="../js/test/test.js"></script>
```



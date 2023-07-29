##

git branch demo //建分支以及换分支

git checkout demo

git add -f dist //强制推送打包文件

git commit -m ""

git subtree push --prefix dist origin demo  
//将打包文件单独推送到远程仓库

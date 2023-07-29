暂存file/folder :   
```
git add <name> 
git rm <name> //undo add
git add -A    //add all files to staging area 
```
提交
```
git commit -m "提交说明信息"
```
与远程仓库连接
```
git remote add [给远程仓库起名] [远程仓库地址] 
git remote rename origin notOrigin //改名
```
推送简化
```
git push -u origin main //u:upstream,下次推送按上次的配置
git push //无需指定远程仓库和分支名
```
临时切换分支原分支的代码处理
```
git stash 
git stash pop 
```
写分支时main分支更新的处理
```
git checkout mybranch
git rebase main
//假设mybranch是main的A版本分出来的，main的最新版本为X
//mybranch的所有版本撤销commit并暂存，在main的最新版本X上重新commit
```
反悔
```
git checkout [filename] //撤销在工作区的修改
git reset HEAD [filename]//从暂存区打回工作区
git reset HEAD^         //已commit退回上一版本
git reset [版本id]      //退回指定版本
```
> https://www.runoob.com/git/git-reset.html

Git 使用说明（适用于本项目）

适用于本地项目已存在，远程仓库已在 GitHub 创建好的情况。
✅ 一、初始化本地 Git 仓库

cd 项目目录路径          # 进入你的项目根目录
git init                 # 初始化 Git 仓库

✅ 二、配置用户信息（只需一次）

git config --global user.name "你的 GitHub 用户名"
git config --global user.email "你的 GitHub 邮箱"

✅ 三、绑定远程仓库（SSH 推荐）

git remote add origin git@github.com:你的用户名/你的仓库名.git

示例：

git remote add origin git@github.com:God-dev1ce/tardet.git

✅ 四、第一次推送项目（远程仓库已有内容时）

git add .
git commit -m "首次提交"
git pull origin main --allow-unrelated-histories  # 合并远程初始化内容（如README）
git push -u origin main                           # 建立与远程 main 分支的关联

✅ 五、日常操作流程（每次修改后）

git add .                            # 添加所有修改文件
git commit -m "修改了哪些内容"       # 提交说明
git push                             # 推送到 GitHub

✅ 六、拉取远程更新（其他人修改后）

git pull                             # 拉取最新代码

✅ 七、建议添加 .gitignore 文件

内容示例（前端项目推荐忽略的文件）：

node_modules/
dist/
.vscode/
.env
*.log

然后提交：

git add .gitignore
git commit -m "添加 .gitignore 文件"
git push

✅ 八、验证 SSH 是否配置成功

ssh -T git@github.com

成功时会输出：

Hi 你的用户名! You've successfully authenticated...

🛠️ 常见问题
问题	解决方法
提交时报错：Author identity unknown	设置用户名和邮箱：git config --global user.name/email
推送时报错：rejected - fetch first	执行：git pull origin main --allow-unrelated-histories 再推送
每次 push 要输用户名和密码	改为 SSH 方式或设置 Token
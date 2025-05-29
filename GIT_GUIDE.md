📘 GIT_GUIDE.md

# Git 使用指导文档（适用于前后端项目）

本指南适用于已在本地开发、已拥有 GitHub 仓库的新手开发者。

---

## 🧱 一、首次配置 Git（只需一次）

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你的GitHub邮箱"

⚠️ 配置后，你的每一次提交都会带上用户名与邮箱信息。
📁 二、初始化 Git 仓库（本地项目）

cd 项目目录路径
git init

例如：

cd E:/code/your-project-path
git init

🌐 三、连接 GitHub 远程仓库（推荐使用 SSH）
查看远程仓库地址：

GitHub 仓库主页 → Code → 选择 SSH → 复制：

git@github.com:你的用户名/你的仓库.git

添加远程仓库：

git remote add origin git@github.com:你的用户名/你的仓库.git

替换远程地址（如果之前配置错了）：

git remote set-url origin git@github.com:你的用户名/你的仓库.git

🚀 四、首次推送完整流程（本地已有代码）

git add .
git commit -m "首次提交"
git pull origin main --allow-unrelated-histories   # 拉取远程主分支，避免冲突
git push --set-upstream origin main                # 推送并建立本地/远程追踪关系

🔁 五、日常开发流程（常规提交与推送）

git add .                                # 添加所有变动
git commit -m "说明你修改了什么"
git push                                 # 推送到 GitHub 仓库

📥 六、拉取远程更新（多人协作时用）

git pull

⚔️ 七、冲突解决流程（如遇 pull 时冲突）

# 1. 查看冲突提示，打开文件手动编辑冲突内容
# 2. 编辑完后：
git add 冲突文件名
git commit -m "解决冲突"
git push

🧹 八、常见问题处理
问题	解决方法
Author identity unknown	配置用户名邮箱：git config --global user.name/email
main -> main (fetch first)	git pull origin main --allow-unrelated-histories
no upstream branch	git push --set-upstream origin main
merge未完成，MERGE_HEAD exists	git merge --abort，或解决冲突后 git commit
GitHub 推送需要密码（SSH未配置）	配置 SSH 公钥或使用 Token
本地文件乱码（如中文）	文件重命名为英文，如 GIT_GUIDE.md
🚫 九、建议添加 .gitignore 文件内容（前端项目）

node_modules/
dist/
.vscode/
.env
*.log

🔒 十、SSH 配置验证（首次使用）

ssh -T git@github.com

显示：

Hi 用户名! You've successfully authenticated...

表示配置成功。
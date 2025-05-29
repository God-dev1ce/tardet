# 本地测试命令 
npm run dev

# 首先在本地重新打包项目：
npm run build
# 全量推送（如果更新的话记得先删除老的项目文件）：
win系统命令： scp -r ./dist/* root@115.190.42.141:/var/www/tardet/  
# rsync增量更新，只更新有变化的文件（liunx系统可用）：
rsync -avz --delete ./dist/ root@115.190.42.141:/var/www/tardet/
# 最后重启nginx：
systemctl restart nginx



生成SSH密钥对步骤：
# 在本地生成SSH密钥（如果还没有） 直接回车使用默认路径和空密码。
ssh-keygen -t rsa -b 4096
# 将公钥复制到服务器，这里需要输入一次服务器密码。（win系统不可用ssh-copy-id，详情看下方重要提示的操作）
ssh-copy-id root@115.190.42.141
# 测试SSH连接，如果配置成功，应该可以直接登录而无需输入密码。
ssh root@115.190.42.141


# 生成密钥对命令解释：
ssh-keygen -t rsa -b 4096 

ssh-keygen：生成SSH密钥的工具
-t rsa：指定密钥类型为RSA
-b 4096：指定密钥长度为4096位（更安全）

# 默认路径：
在Linux/macOS系统下：~/.ssh/
在Windows系统下：C:\Users\你的用户名\.ssh\

# 执行命令后会生成两个文件：
私钥文件：id_rsa（必须妥善保管，不要泄露）
公钥文件：id_rsa.pub（可以公开，用于配置到服务器）

# 执行过程会提示：
输入保存密钥的文件路径（直接回车使用默认路径）
输入密钥的密码（直接回车表示不设置密码）
确认密码（如果设置了密码）
生成的密钥对可以用于SSH免密登录、Git操作等场景

# 重要！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
在Windows系统中，ssh-copy-id命令不可用，但你可以通过以下步骤手动完成公钥的复制：

找到公钥文件： 默认路径为：C:\Users\你的用户名\.ssh\id_rsa.pub

复制公钥内容： 用记事本打开id_rsa.pub文件，复制全部内容。

登录到服务器：

执行以下命令：
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo '你的公钥内容' >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
测试连接：
ssh root@115.190.42.141
如果配置成功，应该可以直接登录而无需输入密码。
exit 退出服务器
注意：
id_rsa.pub文件中的内容是你的公钥，需要替换为你自己的公钥内容。
确保服务器上的~/.ssh目录和authorized_keys文件的权限正确设置。
如果需要在多个服务器上使用相同的密钥对，可以将公钥内容添加到每个服务器的authorized_keys文件中。



# 修改Nginx配置
修改步骤：
查找配置文件：
nginx -t
这个命令会显示Nginx配置文件的路径。

编辑配置文件：
sudo nano /etc/nginx/sites-available/default
常见配置项：

server {
    listen 80;
    server_name your_domain.com;

    root /var/www/tardet;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
测试配置：
sudo nginx -t
重启Nginx：
sudo systemctl restart nginx


# nginx的多种不同配置
1. 使用不同端口
修改Nginx配置，为每个网站分配不同的端口：


server {
    listen 80;
    server_name _;
    root /var/www/tardet;
}

server {
    listen 8080;
    server_name _;
    root /var/www/another_site;
}
访问方式：
http://115.190.42.141（默认网站）
http://115.190.42.141:8080（另一个网站）


2. 使用子目录
将不同网站放在主站点的子目录下：

server {
    listen 80;
    server_name _;

    location /site1/ {
        root /var/www/tardet;
    }

    location /site2/ {
        root /var/www/another_site;
    }
}
访问方式：
http://115.190.42.141/site1
http://115.190.42.141/site2

3. 使用域名（推荐）
为每个网站配置不同的域名：

server {
    listen 80;
    server_name site1.com;
    root /var/www/tardet;
}

server {
    listen 80;
    server_name site2.com;
    root /var/www/another_site;
}
访问方式：
http://site1.com
http://site2.com

✅ 修改 nginx 配置后记得：

sudo nginx -t        # 测试配置
sudo systemctl reload nginx  # 应用修改
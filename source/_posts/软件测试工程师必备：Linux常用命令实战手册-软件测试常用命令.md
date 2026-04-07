---
title: 软件测试工程师必备：Linux常用命令实战手册-软件测试常用命令
date: 2026-04-06
tags:
  - Linux
  - 测试工具
  - 命令行
categories:
  - 开发工具
  - 自动化测试
cover: /img/canyon.jpg
top_img: /img/canyon.jpg
---


作为一名软件测试工程师，熟练掌握Linux常用命令是必不可少的技能。这些命令不仅有助于高效地管理和 操作系统 ，还能在测试过程中快速定位和解决问题。

Linux常用命令是软件测试工程师在测试过程中经常使用的工具，帮助管理文件、 控制 进程、检查网络和监控系统。这些命令简单易学，能提升测试效率。

在软件测试工作中，Linux命令是定位缺陷、分析日志、监控系统的核心工具。本文从日志分析、文件操作、进程管理、网络调试等维度，整理测试工程师高频使用的Linux命令及实战场景，助力提升测试效率。


### 一、日志分析篇

1\. 实时日志监控

```bash
tail -f /var/log/app/error.log  
tail -f app.log | grep "ERROR"  
tail -n 100 app.log | grep -C 5 "Exception"  
```

2\. 日志统计与过滤

```bash
grep -c "NullPointerException" app.log  sed -n '/2024-03-01 14:00:00/,/2024-03-01 15:00:00/p' app.log  cat app.log | grep "ERROR" | grep -v "Timeout"  
```

### 二、文件操作篇

1\. 文件搜索与处理

```bash
find /opt/app/logs -name "*.log"  rename 's/test_/prod_/' test_*.csv  dd if=/dev/zero of=test.data bs=1M count=1024  
```

2\. 文件内容操作

```bash
diff -u result_v1.txt result_v2.txt  awk -F ',' '{print $3}' test_data.csv  sed -i 's/host=dev/host=test/' config.properties  
```

### 三、进程管理篇

1\. 进程监控与操作

```bash
ps -ef | grep java  kill -9 1234  top -p 1234  
```



2\. 线程级分析

```bash
jstack 1234 > thread_dump.txt  watch -n 1 "ps -eLf | grep app | wc -l"  
```



### 四、网络调试篇

1\. 网络状态检查

```bash
netstat -tuln | grep 8080  watch -n 1 "netstat -ant | awk '{print \$6}' | sort | uniq -c"  traceroute api.example.com  
```



2\. HTTP接口测试

```bash
curl -X POST http://localhost:8080/api/login -d '{"user":"test"}'  wget -O test.zip http://download.example.com/largefile.zip  wget --limit-rate=100k http://example.com/file  
```



### 五、系统监控篇

1\. 资源监控

```bash
htop  df -h  iostat -x 2  
```



2\. 网络流量监控

```bash
iftop -i eth0  tcpdump -i eth0 port 8080 -w capture.pcap  
```



### 六、权限与用户管理

1\. 文件权限控制

```bash
chmod +x test_script.sh  chmod -R 755 /opt/app  
```



2\. 用户与组管理

```bash
useradd tester -m -s /bin/bash  usermod -aG sudo tester  
```



### 七、环境管理篇

1\. 环境变量 操作

```bash
export DB_HOST=testdb.example.com  env | grep DB_  
```



2\. 容器化 测试环境

```bash
docker logs -f app_container  docker exec -it app_container /bin/bash  
```



### 八、实用小工具

1\. 文本处理

```bash
wc -l report.csv  shuf -n 1000 users.csv > sample_data.csv  
```



2\. 时间操作

```bash
time curl -s http://localhost:8080/api/ping  date -d @1712345678 "+%Y-%m-%d %H:%M:%S"  
```



### 九、测试场景命令速查表

|**类别**|**命令**|**描述**|**语法**|**示例**|
|---|---|---|---|---|
|文件管理|pwd|打印当前工作目录|pwd|pwd 输出 /home/user/test\_directory|
|ls|列出文件和目录|ls -l|ls -l 显示详细列表|
|cd|更改目录|cd /path/to/directory|cd /path/to/test/project|
|mkdir|创建新目录|mkdir new\_test\_dir|mkdir test\_data|
|touch|创建新文件|touch test\_file.txt|touch test\_case.txt|
|cp|复制文件或目录|cp file1 file2|cp file1 file2 复制 file1 到 file2|
|mv|移动或重命名文件或目录|mv old\_name new\_name|mv old\_name new\_name|
|rm|删除文件或目录|rm file\_to\_delete|rm temp\_file|
|cat|显示文件内容|cat file.txt|cat test\_log.txt|
|less|分页查看文件|less large\_file.txt|less test\_report.txt|
|grep|在文件中搜索模式|grep "pattern" file.txt|grep "error" log.txt|
|进程管理|ps|列出运行进程|ps -aux|ps -aux 显示所有进程详情|
|top|实时显示系统进程和资源使用|top|top 监控CPU和内存使用|
|kill|按PID终止进程|kill 1234|kill 1234 终止PID为1234的进程|
|bg|将命令运行在后台|bg|在Ctrl+Z后使用 bg 运行后台任务|
|fg|将后台进程带到前台|fg %1|fg %1 带第一个后台任务到前台|
|jobs|列出所有活动任务|jobs|jobs 查看后台运行的任务|
|网络命令|ping|检查主机是否可达|ping google.com|ping google.com 测试网络连接|
|ssh|安全连接远程机器|ssh user@remote\_host|ssh user@server|
|scp|安全复制文件到远程机器|scp local\_file user@remote\_host:/remote/path/|scp test\_file user@server:/remote/path/|
|curl|传输数据到或从服务器|curl -O https://example.com/file.zip|curl -O https://example.com/test\_data.zip|
|netstat|显示网络统计|netstat -tlnp|netstat -tlnp 列出监听端口和进程|
|ifconfig|配置和显示网络接口|ifconfig eth0|ifconfig eth0 查看eth0接口详情|
|dig|查询DNS服务器查找域名的IP地址|dig google.com|dig example.com 获取DNS信息|
|系统监控|uname|显示系统信息|uname -a|uname -a 显示详细系统信息|
|free|显示内存使用|free -m|free -m 以MB为单位显示内存使用|
|df|显示磁盘空间使用|df -h|df -h 以人类可读格式显示磁盘空间|
|top 或 htop|实时监控系统资源|top|top 查看CPU和内存使用|
|lsof|列出打开的文件和相关进程|\`lsof|grep file\_name\`|
|vmstat|报告虚拟内存统计|vmstat 1|vmstat 1 每秒报告一次统计|
|sar|系统活动报告器，性能数据|sar -u 1 5|sar -u 1 5 每秒报告5次CPU使用率|
|脚本自动化|bash|默认shell，用于编写脚本|#!/bin/bash|创建脚本文件，添加shebang|
|for、while、if|控制流语句，用于脚本逻辑|for i in {1..5}; do echo $i; done|for i in {1..5}; do echo $i; done 打印1到5|
|echo、read|输入输出处理|read -p "Enter name: " name; echo "Hello, $name!"|read -p "Enter name: " name; echo "Hello, $name!" 读取输入并打印|
|chmod|更改文件权限|chmod +x script.sh|chmod +x test\_script.sh 使脚本可执行|
|crontab|定时任务调度|crontab -e 然后添加 0 \* \* \* \* /path/to/script.sh|crontab -e 编辑，每小时运行脚本|
|版本控制（Git）|git clone|从远程克隆仓库|git clone https://github.com/user/repo|git clone https://github.com/user/test\_repo|
|git pull|更新本地仓库|git pull origin master|git pull origin main 更新主分支|
|git add|暂存更改|git add .|git add . 暂存所有更改|
|git commit|提交更改，带消息|git commit -m "Commit message"|git commit -m "Update test cases"|
|git push|推送本地更改到远程仓库|git push origin master|git push origin main 推送主分支|
|git checkout|切换分支或提交|git checkout feature/new\_feature|git checkout feature/test 切换到测试分支|
|测试特定命令|make|构建和编译软件|make|make 在有Makefile的目录编译项目|
|test|脚本中简单条件检查|if test -f file.txt; then echo "File exists."; fi|if test -f test\_log.txt; then echo "Log exists."; fi 检查文件是否存在|
|time|测量命令执行时间|time ./my\_test\_script.sh|time ./run\_tests.sh 测量测试脚本运行时间|
|valgrind|内存调试工具|valgrind ./my\_program|valgrind ./test\_app 检查内存泄漏|

|测试场景|常用命令组合|
|---|---|
|**接口响应慢**|curl -o /dev/null -s -w "%{time\_total}\\n" \[URL\]|
|**内存泄漏排查**|jmap -histo:live <pid> > heap.txt|
|**大文件传输测试**|rsync -avz --progress src/ user@host:/dest/|
|**服务启动检查**|systemctl status app.service|
|批量杀死进程|ps -ef|

### 十、进阶技巧

1\. 管道符组合命令

```bash
cat app.log | grep "ERROR" | awk '{print $5}' | sort | uniq -c | sort -nr | head -n 10  
```



2\. 定时任务（Cron）

```bash
0 0 * * * find /var/log/app -name "*.log" -mtime +7 -exec rm {} \;  
```

### `总结`

以上命令只是Linux系统中众多命令的一部分，但对于软件测试工程师而言，掌握这些基本命令将大大提高工作效率和问题 解决 能力。在实际工作中，结合具体需求，灵活运用这些命令，将有助于您更高效地完成测试任务。

Linux常用命令是软件测试工程师的必备技能，涵盖 文件管理 、进程控制和系统监控。通过掌握这些命令，您可以高效完成测试任务，确保软件质量。这不仅是技术工具，更是提升测试效率的关键。

“掌握Linux命令，测试工程师的效率从此飞跃！”

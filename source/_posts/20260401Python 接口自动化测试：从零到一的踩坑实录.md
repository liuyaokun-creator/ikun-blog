---
title: Python 接口自动化测试：从零到一的踩坑实录
date: 2026-04-01 22:55
tags:
  - Python
  - 接口测试
  - 自动化测试
categories:
  - 测试开发
---

作为一名刚入行的测试开发工程师，我第一次接手接口自动化测试任务时，心里既兴奋又忐忑。当时项目是用 Python + Requests 实现的，原本以为很简单，结果却踩了多个大坑。今天就来分享一下我的真实经历和经验。

---

### 一、初识 Requests 库

一开始我选择的是 `requests` 这个库，因为它简单易用。写了一个简单的 GET 请求示例：

```python
import requests

response = requests.get('https://api.example.com/data')
print(response.status_code)
print(response.json())
```

运行后确实能获取数据，但后来发现每次请求都要手动处理 Cookie、Header 等信息，非常繁琐。这时候我才意识到，**接口测试不只是发送请求这么简单**。

---

### 二、封装成通用接口类

为了提高可维护性，我决定将请求封装成一个类：

```python
class ApiClient:
    def __init__(self):
        self.base_url = 'https://api.example.com'

    def get(self, endpoint, params=None):
        url = f'{self.base_url}/{endpoint}'
        response = requests.get(url, params=params)
        return response.json()

# 使用
client = ApiClient()
data = client.get('user/1')
print(data)
```

这个封装让我在后续的测试中节省了不少时间，但同时也暴露了一个问题：**没有统一处理异常**。有一次某个接口返回 500 错误，程序直接崩溃，导致整个测试流程中断。

---

### 三、踩坑：错误处理缺失

一次线上环境测试中，因为接口返回异常，程序直接报错退出。我花了半天才找到原因——**没有对 HTTP 状态码进行判断**。

正确的做法应该是：

```python
def get(self, endpoint, params=None):
    url = f'{self.base_url}/{endpoint}'
    response = requests.get(url, params=params)
    if response.status_code != 200:
        raise Exception(f'API request failed: {response.status_code}')
    return response.json()
```

**教训：别忽略 HTTP 响应状态码，它是接口是否成功的最直接依据。**

---

### 四、用 Pytest 提升测试效率

后来引入了 `pytest` 框架，测试用例变得更规范。例如：

```python
import pytest
from api_client import ApiClient

@pytest.fixture
def client():
    return ApiClient()

def test_get_user(client):
    data = client.get('user/1')
    assert data['id'] == 1
```

这样可以方便地进行参数化测试和断言管理。不过，**有时候依赖的接口数据不一致也会导致测试失败**，这时候就需要 mock 或者预置数据。

---

### 总结

接口自动化测试看似简单，但真正做起来还是有很多细节需要注意。从最初的 `requests` 使用，到封装成类、加入错误处理、引入测试框架，每一步都是一次学习和成长。希望我的踩坑经验能帮助你在自动化测试的路上少走弯路。
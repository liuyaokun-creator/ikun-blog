---
title: Java IO体系：BIO、NIO与AIO演进之路
date: 2024-05-08
updated: 2024-05-08
tags: [Java, IO, 基础]
categories: [Java, 基础]
---

# Java IO体系：BIO、NIO与AIO演进之路

# 一、IO概述

IO（Input/Output）是计算机系统与外部世界（磁盘、网络、终端）进行数据交换的基础。Java的IO体系经历了从传统的阻塞IO（BIO）到非阻塞IO（NIO），再到异步IO（AIO）的演进过程。

# 二、BIO (Blocking IO)

BIO是Java早期（JDK 1.0/1.4）提供的IO模型，位于`java.io`包。

## 2.1 核心概念
-   **流（Stream）**：面向流的传输。
    -   **字节流**：`InputStream`, `OutputStream`（处理二进制数据，如图片、视频）。
    -   **字符流**：`Reader`, `Writer`（处理文本数据，自动处理编码）。
-   **阻塞模型**：当发起IO请求时，线程会被阻塞，直到数据就绪。这意味着每个连接都需要一个独立的线程处理，并发能力受限（One Thread Per Connection）。

# 三、NIO (Non-blocking IO / New IO)

NIO是JDK 1.4引入的，位于`java.nio`包，旨在解决BIO高并发性能差的问题。

## 3.1 核心组件

1.  **Buffer（缓冲区）**：
    -   NIO是面向缓冲区的。数据读取到一个缓冲区，或从缓冲区写入。
    -   常用`ByteBuffer`，需关注`position`, `limit`, `capacity`等属性。

2.  **Channel（通道）**：
    -   类似于流，但是双向的（可读可写）。
    -   常见有`FileChannel`, `SocketChannel`, `ServerSocketChannel`。

3.  **Selector（选择器）**：
    -   NIO的核心。一个Selector可以监听多个Channel的事件（如连接请求、数据到达）。
    -   **多路复用**：单线程可以管理成千上万个连接。

## 3.2 适用场景
适合连接数目多且连接比较短（轻操作）的架构，如聊天服务器、Web服务器（Netty底层基于NIO）。

# 四、AIO (Asynchronous IO)

AIO（NIO 2.0）是JDK 1.7引入的，位于`java.nio.channels`包。

-   **异步模型**：基于事件和回调机制。应用程序发起IO请求后直接返回，操作系统在IO完成后通知应用程序（或调用回调函数）。
-   **特点**：真正的异步非阻塞，无需轮询。

# 五、总结

-   **BIO**：编程简单，适合连接数少且固定的架构。
-   **NIO**：编程复杂，适合连接数多且连接短的架构（高并发核心）。
-   **AIO**：编程复杂，适合连接数多且连接长的架构（如相册服务器）。

现代Java高性能网络编程（如Netty）主要基于NIO，因为它在Linux上（使用epoll）表现极其优秀且成熟。掌握IO模型的演进，是通往高性能后端开发的必经之路。

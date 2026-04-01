---
title: Java多线程核心：从Thread到Executor框架
date: 2024-05-06
updated: 2024-05-06
tags: [Java, 多线程, 并发]
categories: [Java, 基础]
---

# Java多线程核心：从Thread到Executor框架

# 一、线程基础

在Java中，线程是操作系统调度的最小单元。实现多线程主要有三种方式：

1.  **继承Thread类**：重写`run()`方法。
2.  **实现Runnable接口**：实现`run()`方法，通过`new Thread(runnable).start()`启动。
3.  **实现Callable接口**：配合`FutureTask`，支持返回值和抛出异常。

推荐使用接口方式，因为Java是单继承的，实现接口更灵活。

# 二、线程生命周期

Java线程的状态定义在`Thread.State`枚举中：

-   **NEW**：新建状态，尚未启动。
-   **RUNNABLE**：可运行状态（包括Running和Ready）。
-   **BLOCKED**：阻塞状态，等待锁。
-   **WAITING**：无限等待，需被唤醒。
-   **TIMED_WAITING**：超时等待，如`sleep(1000)`。
-   **TERMINATED**：终止状态。

# 三、线程安全与同步

当多个线程访问共享资源时，需要保证线程安全。

## 3.1 synchronized
Java内置锁，可修饰方法或代码块。
-   **原理**：基于对象头Monitor（监视器）锁。
-   **优化**：JDK 6后引入了偏向锁、轻量级锁、重量级锁的锁升级机制。

## 3.2 volatile
-   **作用**：保证变量的**可见性**和**禁止指令重排序**，但不保证原子性。
-   **场景**：状态标记量、单例模式的双重检查锁定（DCL）。

# 四、Executor框架与线程池

手动创建线程（`new Thread`）存在开销大、不易管理等问题。Java提供了`Executor`框架来管理线程池。

## 4.1 核心参数 (ThreadPoolExecutor)

```java
public ThreadPoolExecutor(
    int corePoolSize,    // 核心线程数
    int maximumPoolSize, // 最大线程数
    long keepAliveTime,  // 空闲线程存活时间
    TimeUnit unit,       // 时间单位
    BlockingQueue<Runnable> workQueue, // 任务队列
    ThreadFactory threadFactory,       // 线程工厂
    RejectedExecutionHandler handler   // 拒绝策略
)
```

## 4.2 常见线程池

-   **FixedThreadPool**：固定大小线程池。
-   **CachedThreadPool**：可缓存线程池，适合大量短任务。
-   **SingleThreadExecutor**：单线程池，保证任务顺序执行。
-   **ScheduledThreadPool**：支持定时任务。

**注意**：阿里巴巴Java开发手册禁止使用`Executors`创建线程池，建议手动创建`ThreadPoolExecutor`以明确参数，避免OOM风险。

# 五、总结

多线程编程是Java高阶开发的基石。从基础的线程控制到复杂的并发工具类（JUC），掌握线程安全、锁机制以及线程池的原理，能够帮助我们构建高性能、高可用的并发系统。

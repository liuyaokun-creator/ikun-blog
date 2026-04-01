---
title: Java集合框架全景：List、Set与Map深度解析
date: 2024-05-05
updated: 2024-05-05
tags: [Java, 集合, 数据结构]
categories: [Java, 基础]
---

# Java集合框架全景：List、Set与Map深度解析

# 一、集合框架概览

Java集合框架（Java Collections Framework）提供了一套性能优良、使用方便的数据结构和算法。其核心接口主要分为两大体系：

1.  **Collection接口**：存储一组对象，子接口包括`List`、`Set`、`Queue`。
2.  **Map接口**：存储键值对（Key-Value）。

# 二、List系列

`List`是一个有序集合，允许重复元素。

## 2.1 ArrayList
-   **底层实现**：动态数组。
-   **特点**：查询快（随机访问O(1)），增删慢（需要移动元素）。
-   **扩容机制**：默认初始容量10，扩容时通常变为原来的1.5倍。

## 2.2 LinkedList
-   **底层实现**：双向链表。
-   **特点**：增删快（只需修改指针），查询慢（需要遍历）。
-   **应用**：适合频繁插入删除的场景，还可实现栈和队列。

# 三、Set系列

`Set`是一个无序集合（部分实现有序），不允许重复元素。

## 3.1 HashSet
-   **底层实现**：基于`HashMap`实现，只使用了Key，Value默认为Object对象。
-   **特点**：无序，存取速度快。
-   **去重原理**：依赖`hashCode()`和`equals()`方法。

## 3.2 TreeSet
-   **底层实现**：红黑树（基于`TreeMap`）。
-   **特点**：有序（自然排序或定制排序）。
-   **应用**：需要对元素进行排序的场景。

# 四、Map系列

`Map`用于保存映射关系的数据。

## 4.1 HashMap
-   **底层实现**：数组 + 链表 + 红黑树（JDK 8）。
-   **特点**：无序，非线程安全，允许null键和null值。
-   **扩容**：默认初始容量16，加载因子0.75。当链表长度超过8且数组长度超过64时，转为红黑树。

## 4.2 ConcurrentHashMap
-   **特点**：线程安全，高性能。
-   **原理**：JDK 7使用分段锁（Segment），JDK 8使用`CAS + synchronized`锁住链表/红黑树的头节点，锁粒度更细。

## 4.3 LinkedHashMap
-   **特点**：维护插入顺序或访问顺序。
-   **应用**：LRU缓存算法实现。

# 五、总结

Java集合框架是日常开发中最常用的工具之一。选择合适的集合类（如ArrayList vs LinkedList，HashMap vs TreeMap）对程序性能影响巨大。此外，理解`hashCode`和`equals`的契约对于正确使用Hash类集合至关重要。

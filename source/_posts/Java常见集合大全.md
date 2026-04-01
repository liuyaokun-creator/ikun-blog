---
title: Java常见集合大全：从ArrayList到ConcurrentHashMap全面解析
date: 2024-05-13
tags: [Java, 集合, 数据结构, 基础]
categories: [Java, 核心技术]
updated: 2024-05-13
---

在Java开发中，集合框架是数据结构和算法的基石，是日常编程中不可缺少的重要工具。掌握各种集合的特点和使用场景，对于编写高效、稳定的程序至关重要。本文将从**定义、特点、应用场景、源码分析**等多个维度，全面解析Java集合框架中的核心成员。

# Java常见集合大全：从ArrayList到ConcurrentHashMap全面解析

## 一、Java集合框架概览

Java集合框架（Java Collections Framework，JCF）为程序开发提供了丰富的数据结构实现，主要包括以下几大接口：

- **Collection接口**：单列数据，包括List、Set、Queue
  - **List**：有序、可重复
  - **Set**：无序、不可重复
  - **Queue**：队列，先进先出
- **Map接口**：双列数据（键值对），包括HashMap、TreeMap等

## 二、List系列详解

### 2.1 ArrayList

**底层实现**：动态数组，基于Object[]实现

**特点**：
- 查询效率高：O(1)时间复杂度
- 插入删除效率低：平均O(n)时间复杂度，需要移动后续元素
- 线程不安全
- 默认初始容量为10，扩容时增长为原容量的1.5倍

**代码案例**：
```java
import java.util.ArrayList;
import java.util.List;

public class ArrayListDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();
        list.add("Java"); // 添加元素
        list.add("Python");
        list.add("C++");
        
        System.out.println("列表内容：" + list); // [Java, Python, C++]
        System.out.println("索引1的元素：" + list.get(1)); // Python
        
        // 随机访问效率高
        for (int i = 0; i < list.size(); i++) {
            System.out.println("元素" + i + ": " + list.get(i));
        }
    }
}
```

**适用场景**：查询多、插入删除少的场景

### 2.2 LinkedList

**底层实现**：双向链表，每个节点包含前驱和后继指针

**特点**：
- 插入删除效率高：O(1)时间复杂度（找到位置后）
- 查询效率低：O(n)时间复杂度，需要遍历
- 占用内存相对较多（存储前后节点引用）
- 既可作为List使用，也可作为队列（Queue）或栈使用

**代码案例**：
```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;

public class LinkedListDemo {
    public static void main(String[] args) {
        LinkedList<Integer> linkedList = new LinkedList<>();
        linkedList.addLast(1); // 链表尾部添加
        linkedList.addFirst(0); // 链表头部添加
        linkedList.add(1, 5); // 在索引1位置插入
        
        System.out.println("链表内容：" + linkedList); // [0, 5, 1]
        
        // 作为队列使用
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(1);
        queue.offer(2);
        System.out.println("队列头部：" + queue.peek()); // 1
        System.out.println("出队：" + queue.poll()); // 1
        
        // 作为栈使用
        Stack<Integer> stack = new Stack<>();
        stack.push(1);
        stack.push(2);
        System.out.println("栈顶：" + stack.peek()); // 2
        System.out.println("出栈：" + stack.pop()); // 2
    }
}
```

**适用场景**：频繁插入删除操作的场景

### 2.3 Vector

**特点**：
- 线程安全（方法使用synchronized关键字）
- 性能低于ArrayList
- 扩容时增长为原容量的2倍（可自定义增长策略）

Vector现在很少使用，多被ArrayList + Collections.synchronizedList()替代。

## 三、Set系列详解

### 3.1 HashSet

**底层实现**：基于HashMap实现，只使用key，value为一个固定的Object对象

**特点**：
- 元素无序（插入顺序和输出顺序可能不一致）
- 元素不可重复
- 允许null值
- 查询、添加、删除效率高：O(1)平均时间复杂度
- 依赖hashCode()和equals()方法判断元素是否重复

**代码案例**：
```java
import java.util.HashSet;
import java.util.Set;

public class HashSetDemo {
    public static void main(String[] args) {
        Set<String> set = new HashSet<>();
        set.add("Apple");
        set.add("Banana");
        set.add("Orange");
        set.add("Apple"); // 重复元素，不会添加
        
        System.out.println("Set内容：" + set); // [Apple, Orange, Banana]，顺序可能不同
        
        System.out.println("是否包含Apple：" + set.contains("Apple")); // true
        System.out.println("Set大小：" + set.size()); // 3
    }
}
```

### 3.2 LinkedHashSet

**底层实现**：继承自HashSet，内部使用双向链表维护元素插入顺序

**特点**：
- 继承HashSet的所有特性
- 维护元素插入顺序
- 性能略低于HashSet（需要维护链表）

**代码案例**：
```java
import java.util.LinkedHashSet;
import java.util.Set;

public class LinkedHashSetDemo {
    public static void main(String[] args) {
        Set<String> linkedSet = new LinkedHashSet<>();
        linkedSet.add("First");
        linkedSet.add("Second");
        linkedSet.add("Third");
        linkedSet.add("First"); // 重复元素，不会添加
        
        System.out.println("LinkedHashSet内容：" + linkedSet); 
        // [First, Second, Third]，保持插入顺序
    }
}
```

### 3.3 TreeSet

**底层实现**：基于TreeMap（红黑树）实现

**特点**：
- 元素有序（自然排序或自定义排序）
- 查询、添加、删除效率：O(log n)
- 不允许null值
- 支持范围查找操作

**代码案例**：
```java
import java.util.TreeSet;

public class TreeSetDemo {
    public static void main(String[] args) {
        TreeSet<Integer> treeSet = new TreeSet<>();
        treeSet.add(5);
        treeSet.add(2);
        treeSet.add(8);
        treeSet.add(1);
        
        System.out.println("TreeSet内容：" + treeSet); // [1, 2, 5, 8]，自然排序
        
        // 范围查找
        System.out.println("小于5的元素：" + treeSet.headSet(5)); // [1, 2]
        System.out.println("大于等于2的元素：" + treeSet.tailSet(2)); // [2, 5, 8]
        System.out.println("2到8之间的元素：" + treeSet.subSet(2, 8)); // [2, 5]
    }
}
```

## 四、Map系列详解

### 4.1 HashMap

**底层实现**：数组 + 链表 + 红黑树（JDK 8及以后）

**特点**：
- 键值对存储
- 键不可重复，值可重复
- 无序
- 非线程安全
- 查询、添加、删除效率高：O(1)平均时间复杂度
- 当链表长度超过8且数组长度超过64时，链表转为红黑树

**代码案例**：
```java
import java.util.HashMap;
import java.util.Map;

public class HashMapDemo {
    public static void main(String[] args) {
        Map<String, Integer> map = new HashMap<>();
        map.put("Java", 95);
        map.put("Python", 88);
        map.put("C++", 92);
        
        System.out.println("Map内容：" + map); 
        System.out.println("Java分数：" + map.get("Java")); // 95
        
        // 遍历Map
        for (Map.Entry<String, Integer> entry : map.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
        
        // 检查是否存在键
        System.out.println("是否包含键'Go'：" + map.containsKey("Go")); // false
    }
}
```

### 4.2 LinkedHashMap

**底层实现**：继承自HashMap，额外维护一个双向链表来维护元素顺序

**特点**：
- 继承HashMap的所有特性
- 维护元素插入顺序或访问顺序
- 性能略低于HashMap
- 适合实现LRU缓存

**代码案例**：
```java
import java.util.LinkedHashMap;
import java.util.Map;

public class LinkedHashMapDemo {
    public static void main(String[] args) {
        // 按插入顺序访问
        Map<String, Integer> linkedMap = new LinkedHashMap<>();
        linkedMap.put("First", 1);
        linkedMap.put("Second", 2);
        linkedMap.put("Third", 3);
        
        System.out.println("LinkedHashMap内容：" + linkedMap);
        // {First=1, Second=2, Third=3}，保持插入顺序
    }
}
```

### 4.3 TreeMap

**底层实现**：基于红黑树实现

**特点**：
- 键值对按键有序排列
- 查询、添加、删除效率：O(log n)
- 键必须实现Comparable接口或提供Comparator
- 支持范围查找操作

**代码案例**：
```java
import java.util.TreeMap;

public class TreeMapDemo {
    public static void main(String[] args) {
        TreeMap<String, Integer> treeMap = new TreeMap<>();
        treeMap.put("Java", 95);
        treeMap.put("C++", 92);
        treeMap.put("Python", 88);
        
        System.out.println("TreeMap内容：" + treeMap); 
        // {C++=92, Java=95, Python=88}，按字典序排列
        
        // 范围查找
        System.out.println("小于'Python'的键值对：" + treeMap.headMap("Python"));
        // {C++=92, Java=95}
    }
}
```

### 4.4 ConcurrentHashMap

**底层实现**：JDK 7使用分段锁，JDK 8使用CAS + synchronized

**特点**：
- 线程安全
- 高并发性能
- 分段锁技术减少锁竞争
- 不允许null键和null值

**代码案例**：
```java
import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentHashMapDemo {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> concurrentMap = new ConcurrentHashMap<>();
        concurrentMap.put("Thread1", 100);
        concurrentMap.put("Thread2", 200);
        
        // 线程安全的原子操作
        concurrentMap.computeIfAbsent("Thread3", k -> 300);
        System.out.println("ConcurrentHashMap内容：" + concurrentMap);
    }
}
```

## 五、Queue系列详解

### 5.1 PriorityQueue

**底层实现**：二叉堆（完全二叉树）

**特点**：
- 优先队列，元素按优先级排序
- 不是FIFO队列，出队顺序与优先级相关
- 不允许null值

**代码案例**：
```java
import java.util.PriorityQueue;

public class PriorityQueueDemo {
    public static void main(String[] args) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(); // 默认最小堆
        pq.offer(5);
        pq.offer(2);
        pq.offer(8);
        pq.offer(1);
        
        System.out.println("优先队列内容（非完全有序）：" + pq); // [1, 2, 8, 5]
        
        // 按优先级出队
        while (!pq.isEmpty()) {
            System.out.print(pq.poll() + " "); // 输出：1 2 5 8
        }
    }
}
```

## 六、集合选择指南

| 场景 | 推荐集合 | 原因 |
|------|----------|------|
| 需要随机访问 | ArrayList | O(1)查询效率 |
| 频繁插入删除 | LinkedList | O(1)插入删除效率 |
| 需要去重 | HashSet | O(1)查找效率 |
| 需要排序 | TreeSet | O(log n)维护有序性 |
| 键值对存储 | HashMap | O(1)平均查找效率 |
| 多线程环境 | ConcurrentHashMap | 线程安全且性能好 |
| 需要维护插入顺序 | LinkedHashSet/LinkedHashMap | 保持插入顺序 |

## 七、性能优化建议

1. **预设容量**：在创建ArrayList、HashMap等集合时，如果能预估数据量，应指定初始容量以减少扩容开销
2. **选择合适实现**：根据使用场景选择最适合的集合实现
3. **避免装箱拆箱**：在性能敏感场景考虑使用原始类型集合库（如Trove）
4. **及时清理**：不需要的集合对象应及时清理，避免内存泄漏

## 八、总结

Java集合框架是Java编程的基础工具，理解各种集合的特点和适用场景对于编写高质量的代码至关重要。在实际开发中，应根据具体需求选择合适的集合类型，并注意性能优化和线程安全问题。
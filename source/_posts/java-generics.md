---
title: Java泛型编程：类型擦除与通配符实战
date: 2024-05-04
updated: 2024-05-04
tags: [Java, 泛型, 基础]
categories: [Java, 基础]
---

# Java泛型编程：类型擦除与通配符实战

# 一、什么是泛型？

泛型（Generics）是Java 5引入的一项特性，本质是**参数化类型**。它允许在定义类、接口和方法时使用类型参数，从而实现代码的重用和类型安全。

在没有泛型之前，集合中存储的对象都是`Object`类型，取出时需要强制转换，容易引发`ClassCastException`。泛型将类型检查提前到了编译期。

# 二、泛型的使用

## 2.1 泛型类与接口

```java
public class Box<T> {
    private T t;

    public void set(T t) { this.t = t; }
    public T get() { return t; }
}
```

## 2.2 泛型方法

泛型方法可以在普通类中定义，类型参数声明在返回值之前。

```java
public <E> void printArray(E[] inputArray) {
    for (E element : inputArray) {
        System.out.printf("%s ", element);
    }
}
```

# 三、类型擦除（Type Erasure）

Java的泛型是**伪泛型**，这是Java泛型最核心的概念。为了兼容旧版本的字节码，Java编译器在编译时会擦除所有泛型类型信息。

-   `List<String>`和`List<Integer>`在运行时是同一个类（`ArrayList`）。
-   类型参数`T`会被替换为限定类型（如`Object`或`Comparable`）。

这也是为什么我们不能使用`new T()`或`instanceof T`的原因。

# 四、通配符详解

通配符`?`用于解决泛型的不变性问题。

## 4.1 无界通配符 `<?>`

表示任意类型，通常用于只读操作或与类型无关的操作。

```java
public void printList(List<?> list) {
    // ...
}
```

## 4.2 上界通配符 `<? extends T>`

表示T及其子类。适用于**生产者（Producer）**场景，即从集合中读取数据。

```java
// 可以读取Number及其子类，但不能添加（除了null）
List<? extends Number> numbers = new ArrayList<Integer>();
Number n = numbers.get(0); 
```

## 4.3 下界通配符 `<? super T>`

表示T及其父类。适用于**消费者（Consumer）**场景，即向集合中写入数据。

```java
// 可以添加Integer及其子类
List<? super Integer> list = new ArrayList<Number>();
list.add(100);
```

**PECS原则**：Producer Extends, Consumer Super。

# 五、总结

泛型增强了Java代码的类型安全性和复用性，但类型擦除机制也带来了一些局限。理解通配符和PECS原则是掌握泛型编程的关键，能帮助我们设计出更灵活的API。

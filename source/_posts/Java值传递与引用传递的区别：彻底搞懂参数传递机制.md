---
title: Java值传递与引用传递的区别：彻底搞懂参数传递机制
date: 2024-05-11
tags: [Java, 基础语法, 参数传递]
categories: [Java, 核心原理]
updated: 2024-05-11
---
在Java开发中，“值传递”和“引用传递”是高频面试题，也是理解对象操作的核心基础。很多开发者会混淆这两个概念，本文将从**定义、底层原理、代码案例**三个维度彻底解析它们的区别。

# Java值传递与引用传递的区别：彻底搞懂参数传递机制

## 一、先明确：Java中只有“值传递”

首先要纠正一个常见误区：**Java的参数传递方式只有“值传递”，不存在“引用传递”**。

这是因为Java的参数传递规则是：

- 传递基本数据类型时，传递的是“值的副本”；

- 传递引用数据类型时，传递的是“引用地址的副本”。

## 二、基本数据类型的“值传递”

### 定义

基本数据类型（`byte/short/int/long/float/double/boolean/char`）存储在栈内存中，参数传递时，会把**变量的“值”复制一份**传递给方法的形参。

### 代码案例

```java

public class ValuePassDemo {
    public static void main(String[] args) {
        int num = 10;
        changeNum(num);
        System.out.println("main方法中num的值：" + num); // 输出：10
    }

    public static void changeNum(int num) {
        num = 20; // 修改的是形参的副本值
        System.out.println("changeNum方法中num的值：" + num); // 输出：20
    }
}
```

### 原理图解

```Plain Text

main方法栈帧：num = 10（栈内存）
调用changeNum时，复制num的值→形参num=10（changeNum方法栈帧）
changeNum修改形参为20→仅修改当前栈帧的副本
方法执行完后，changeNum栈帧销毁，main方法的num仍为10
```

## 三、引用数据类型的“值传递（传递引用地址的副本）”

### 定义

引用数据类型（类、数组、接口等）的“值”是**堆内存中对象的地址**，参数传递时，会把“地址值”复制一份传递给形参。

此时形参和实参指向**同一个堆内存对象**，所以修改形参指向的对象内容，会影响实参；但修改形参的地址（比如让形参指向新对象），不会影响实参。

### 案例1：修改对象内容（会影响实参）

```java

class User {
    String name;
    public User(String name) {
        this.name = name;
    }
}

public class ReferencePassDemo1 {
    public static void main(String[] args) {
        User user = new User("张三");
        changeUserName(user);
        System.out.println("main方法中user的name：" + user.name); // 输出：李四
    }

    public static void changeUserName(User user) {
        user.name = "李四"; // 修改的是堆中对象的内容
    }
}
```

### 原理图解

```Plain Text

main方法栈帧：user = 0x123（地址，指向堆中User对象）
调用changeUserName时，复制地址→形参user=0x123（指向同一个堆对象）
changeUserName修改user.name→堆中对象的name被修改
方法执行完后，main方法的user仍指向0x123，所以内容被改变
```

### 案例2：修改引用地址（不会影响实参）

```java

public class ReferencePassDemo2 {
    public static void main(String[] args) {
        User user = new User("张三");
        changeUser(user);
        System.out.println("main方法中user的name：" + user.name); // 输出：张三
    }

    public static void changeUser(User user) {
        user = new User("李四"); // 形参指向新的堆对象
    }
}
```

### 原理图解

```Plain Text

main方法栈帧：user = 0x123（指向堆中User对象）
调用changeUser时，复制地址→形参user=0x123
changeUser中user = new User(...)→形参指向新地址0x456
方法执行完后，形参栈帧销毁，main方法的user仍指向0x123，内容无变化
```

## 四、总结：Java参数传递的核心规则

|数据类型|传递内容|方法内修改的影响范围|
|---|---|---|
|基本数据类型|变量值的副本|仅修改方法内的副本，不影响原变量|
|引用数据类型|引用地址的副本|修改对象内容：影响原对象；修改地址：不影响原引用|
简单说：**Java始终是“值传递”——传递的要么是“值的副本”，要么是“地址的副本”**。
# Implement Singleton đúng trong TypeScript

Một thanh niên viết bài hướng dẫn code JavaScript và TypeScript trên Medium. Mình đọc thấy bài viết sai hơn quá nửa, vậy mà cũng có 8K claps. Mình tự hỏi mình đéo phải là ngu lắm rồi sao?, giờ lòi đâu ra 8K súc vật này?. Thậm chí thằng viết còn đéo thể phân biệt được cách define một object là `static` hay `dynamic` trong JavaScript. Nên mình chỉ xin mạn phép viết lại đoạn sai nhất trong bài.

## Singleton

Singleton thì không phải nói nhiều, nó được dùng để đảm bảo performance giảm resource để cấp và khởi tạo các dynamic object. Singleton được dùng khi một object được dùng đi dùng lại nhiều lần, cho cùng một mục đích. Singleton có thể xem là vừa có ưu thế của `static` và `dynamic` object. Singleton được viết nhiều dùng nhiều mình chỉ dùng chung ý tưởng đó nhưng implement riêng cho TypeScript.

```ts
// Need to cache all dynamic instance
const instanceCache: { [key: string]: any } = {};

export function Singleton<T>(
  instanceName: string,
  Constuctor: new (...params: any[]) => T,
  ...constructorParams: any[]
): T {
  if (typeof instanceCache[instanceName] !== 'undefined') {
    // Construct new instance with given params
    instanceCache[instanceName] = new Constuctor(...constructorParams);
  }
  return instanceCache[instanceName];
}

export default Singleton;
```

Code trên chỉ là cache lại dynamic instance vào một static instance, thay vì chỉ dùng được cho một loại constructor thì nó sẽ support cho nhiều loại constructor. Tiếp theo mình viết một example class để test Singleton.

```ts
import { Singleton } from './singleton';

export default class TestClass {
  private name: string;

  private time: Date;

  constructor(name: string) {
    this.name = name;
    this.time = new Date();
  }

  public print() {
    process.stdout.write(`${this.name} - ${this.time.toLocaleString()}\n`);
  }

  public static getInstance(): TestClass {
    return Singleton<TestClass>('test-class-singleton', TestClass, 'Thanos');
  }
}
```

`public static getInstance(): TestClass` là điểm đáng quan tâm ở đây, còn lại thì `TestClass` được định nghĩa hoàn toàn bình thường. Đây là cách mình viết main code:

```ts
import TestClass from './testclass';

const classInstance = TestClass.getInstance();

// Print class's data
classInstance.print();

// Just to make sure it's singleton
setTimeout(() => {
  TestClass.getInstance().print();
}, 10000);
```

Kết quả:

```text
Thanos - 11/28/2020, 10:00:07 AM
Thanos - 11/28/2020, 10:00:07 AM
```

Mình có cẩn thận thêm cái `setTimeout()` để chắc là `constructor()` chỉ được gọi một lần duy nhất. Bạn có thể đọc code, tự suy nghĩ, tự improve nó cho nó hay hơn. Hoặc viết một bài phân tích cái ngu của bài này.

_Đừng tin bất cứ thứ gì trên Internet, bài viết này cũng vậy. Bạn có não mà!._
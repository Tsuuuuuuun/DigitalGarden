---
title:
draft: false
tags:
created: 2025-06-15
modified: 2025-06-15
description: ""
---
私はこのようにしています。

````markdown
## create notes

```dataview
table file.link as "ノートタイトル",
      date(file.cday) as "作成日時"
from "notes"
where date(file.cday) = date(this.file.name)
sort file.ctime asc
```

## modified notes

```dataview
table file.link as "ノートタイトル",
      date(file.cday) as "作成日時",
      date(file.mday) as "編集日時"
from "notes"
where date(file.mday) = date(this.file.name) and date(file.cday) != date(this.file.name)
sort file.mday desc
```

## free

week: [[weekly/2025-W24|2025-W24]]
````

create notes: その日に作成したノート
modified notes: その日に修正したノート
free: 自由記述欄
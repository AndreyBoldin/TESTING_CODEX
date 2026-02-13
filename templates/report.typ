#set page(margin: (top: 18mm, bottom: 18mm, left: 18mm, right: 18mm))
#set text(font: "Times New Roman", size: 12pt)

= Отчёт

*Пациент:* #data.name  
*Возраст:* #data.age  
*Дата:* #data.date  

== Результаты
#for item in data.results {
  - #item.title: *#item.value*
}

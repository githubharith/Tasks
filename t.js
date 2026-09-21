const students = [
    {name: "A",dept:"CSE"},
    {name: "B",dept:"CSE"},
    {name: "C",dept:"ECE"},
    {name: "D",dept:"IT"}
];

const groups = new Map();

for (const student of students){
    const dept = student.dept;

    if (!groups.has(dept)){
        groups.set(dept,[]);
    }

    groups.get(dept).push(student);
}

console.log(groups);
import './bootstrap';
import SimpleBar from 'simplebar';

Array.prototype.forEach.call(
  document.querySelectorAll('.is--scroll'),
  el => new SimpleBar()
);

const add = (x, y) => { return x + y };

const num1 = 1;
const num2 = 2;

let sum = add(num1, num2);

console.log(`The sum of ${num1} and ${num2} is ${sum}.`);

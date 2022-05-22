import './style.css';
import * as generateField from  './generateField.js';


for(let a = 0; a < generateField.COLS_COUNT * generateField.ROWS_COUNT; a += 1){
    const col = document.getElementById(`c-${a}`);
    col.classList.add('r');
}


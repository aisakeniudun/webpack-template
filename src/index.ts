import './style.sass';
import './index.html';

export function change() {
    let el = document.getElementById('app');
    el.innerText = new Date().getTime().toString();
}
async function main() {

}

main();

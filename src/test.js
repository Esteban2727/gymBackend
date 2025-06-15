import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 50, // usuarios virtuales simultáneos
  duration: '50s', // tiempo de duración de la prueba
};

export default function () {
  let res = http.get('http://localhost:3001/routine/bringAllRoutine/48'); // aquí pones tu URL real
  check(res, { 'status es 200': (r) => r.status === 200 });
  sleep(1);
}

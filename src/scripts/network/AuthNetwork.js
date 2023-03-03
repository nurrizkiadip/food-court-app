import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

export default class AuthNetwork {
  static listenForAuth(authObserver) {
    onAuthStateChanged(auth, authObserver);
  }
}

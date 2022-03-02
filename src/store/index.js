import { createStore } from 'vuex'
// Googleプロバイダをimport
import { GoogleAuthProvider } from "firebase/auth";
// Google認証機能をimport
import { getAuth, signInWithRedirect, signOut } from "firebase/auth";
// firestoreをimport
import { getFirestore } from "firebase/firestore"
import { collection, addDoc } from "firebase/firestore";

export default createStore({
  state: {
    login_user: null,
    sideNav: false,
    tasks: []
  },
  getters: {
    userName: state => state.login_user ? state.login_user.displayName : '',
    photoURL: state => state.login_user ? state.login_user.photoURL : '',
    uid: state => state.login_user ? state.login_user.uid : '',
  },
  mutations: {
    setLoginUser(state, user) {
      state.login_user = user
    },
    deleteLoginUser(state) {
      state.login_user = null
    },
    // stateのsideNavの状態を切り替え
    toggleSideNav(state) {
      state.sideNav = !state.sideNav
    },
    addTask(state, task) {
      state.tasks.push(task)
    }
  },
  actions: {
    setLoginUser({ commit }, user) {
      commit('setLoginUser', user)
    },
    // アプリ側のログアウト
    deleteLoginUser({ commit }) {
      commit('deleteLoginUser')
    },
    login() {
      const provider = new GoogleAuthProvider();
      const auth = getAuth();
      signInWithRedirect(auth, provider);
    },
    logout() {
      const auth = getAuth();
      signOut(auth)
    },
    // toggleSideNavのクリックイベントが呼び出されたら実行
    // commitメソッドでmutationsのtoggleSideNavを発火
    toggleSideNav({ commit }) {
      commit('toggleSideNav')
    },

    async addTask({ getters, commit }, task) {
      // firestoreに接続
      const db = getFirestore();
      try {
        if (getters.uid) {
          // firestoreにデータを追加
          const docRef = await addDoc(collection(db, `users/${getters.uid}/tasks`), task);
          console.log("Document written with ID: ", docRef.id);
        }
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      commit('addTask', task)
    }
  },
  modules: {
  }
})
